#!/usr/bin/env python3
"""Build and check this collection using only the Python standard library.

Node.js is needed only when executable demo sources/model tests exist.
"""
import argparse
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
TOKENS = ("{{STYLES}}", "{{MODEL}}", "{{APP}}")


def read_catalog(root):
    data = json.loads((root / "catalog.json").read_text(encoding="utf-8"))
    if data["subject"] not in ("Finance", "Operations"):
        raise ValueError("Unknown subject")
    seen_ids, seen_slugs = set(), set()
    for demo in data["demos"]:
        slug, code = demo["slug"], demo["id"]
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
            raise ValueError(f"Unsafe slug: {slug}")
        prefix = "F" if data["subject"] == "Finance" else "O"
        if not re.fullmatch(prefix + r"[1-7]", code):
            raise ValueError(f"Invalid demo ID: {code}")
        if code in seen_ids or slug in seen_slugs:
            raise ValueError("Duplicate ID or slug")
        seen_ids.add(code)
        seen_slugs.add(slug)
        if demo["status"] not in ("planned", "draft", "ready"):
            raise ValueError(f"Invalid status: {demo['status']}")
        if demo["wave"] not in (1, 2, 3):
            raise ValueError(f"Invalid wave: {slug}")
        if not demo["title"].strip() or not demo["question"].strip():
            raise ValueError(f"Missing title or learning question: {slug}")
        if not (root / "specs" / f"{slug}.md").is_file():
            raise ValueError(f"Missing brief: {slug}")
    return data


class OfflineHTML(HTMLParser):
    """Conservative packaging check, complemented by real offline browser QA."""

    def __init__(self):
        super().__init__()
        self.errors = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ("iframe", "object", "embed", "base"):
            self.errors.append(f"Unsupported embedded/base element: {tag}")
        if tag == "script" and ("src" in attrs or attrs.get("type") == "module"):
            self.errors.append("Scripts must be inline classic scripts")
        if tag == "link" and attrs.get("rel", "").lower() in (
            "stylesheet", "preload", "modulepreload", "prefetch", "preconnect", "dns-prefetch"
        ):
            self.errors.append("Linked runtime assets are not allowed")
        if tag == "link" and attrs.get("href") and not attrs["href"].startswith("data:"):
            self.errors.append("Linked resources must be embedded")
        if tag == "form" and attrs.get("action", "").strip():
            self.errors.append("Form submission is not allowed")
        for attr in ("src", "poster", "srcset", "data", "xlink:href"):
            if attr in attrs and not attrs[attr].startswith(("data:", "#")):
                self.errors.append(f"Non-inline {tag}[{attr}]")
        if tag in ("image", "use") and "href" in attrs:
            if not attrs["href"].startswith(("#", "data:")):
                self.errors.append("SVG references must be embedded")
        href = attrs.get("href", "").strip()
        if tag == "a" and href and not href.startswith(("#", "https://", "mailto:")):
            self.errors.append("Demo navigation must use anchors or explicit web links")
        if href.lower().startswith(("javascript:", "http:")):
            self.errors.append("Unsafe or insecure link")

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)


def validate_offline(text):
    parser = OfflineHTML()
    parser.feed(text)
    errors = parser.errors
    if not re.search(r"<!doctype html>", text, re.I):
        errors.append("Missing HTML doctype")
    for token in TOKENS:
        if token in text:
            errors.append(f"Unexpanded token: {token}")
    # These are intentional conservative gates. Document any false positive;
    # do not interpret a static pass as proof of complete offline behavior.
    for pattern in (
        r"\bfetch\s*\(", r"\bXMLHttpRequest\b", r"\bWebSocket\b",
        r"\bEventSource\b", r"\bsendBeacon\s*\(", r"\bimport\b\s*(?:\(|[\w{*])",
        r"\bimportScripts\s*\(", r"\b(?:SharedWorker|Worker)\s*\(",
        r"\bserviceWorker\b", r"@import\b", r"\beval\s*\(",
        r"\bnew\s+Function\s*\(",
    ):
        if re.search(pattern, text):
            errors.append(f"Unsupported runtime feature: {pattern}")
    for url in re.findall(r"url\(\s*['\"]?([^)'\"]+)", text, re.I):
        if not url.strip().startswith(("data:", "#")):
            errors.append(f"Non-inline CSS resource: {url}")
    if errors:
        raise ValueError("; ".join(errors))


def render_demo(root, demo, require_evidence=True):
    source = root / "src" / demo["slug"]
    page = (source / "page.html").read_text(encoding="utf-8")
    styles = ((root / "src/shared/theme.css").read_text(encoding="utf-8")
              + "\n" + (source / "styles.css").read_text(encoding="utf-8"))
    values = [styles, (source / "model.js").read_text(encoding="utf-8"),
              (source / "app.js").read_text(encoding="utf-8")]
    if "</style" in styles.lower() or any("</script" in s.lower() for s in values[1:]):
        raise ValueError("Inline asset contains a closing style/script tag")
    for token, value in zip(TOKENS, values):
        if page.count(token) != 1:
            raise ValueError(f"Expected exactly one {token} in {source}/page.html")
        page = page.replace(token, value)
    validate_offline(page)
    for required in (() if not require_evidence else (root / "tests" / f"{demo['slug']}.test.cjs",
                     root / "verification" / f"{demo['slug']}.md")):
        if not required.is_file() or not required.read_text(encoding="utf-8").strip():
            raise ValueError(f"Ready demo requires tests and browser evidence: {required.name}")
    return page


def render_catalog(root, data):
    esc = html.escape
    ready = sum(d["status"] == "ready" for d in data["demos"])
    rows = []
    for demo in data["demos"]:
        actions = '<span class="status">Planned</span>'
        if demo["status"] == "draft":
            actions = '<span class="status">In development</span>'
        if demo["status"] == "ready":
            file = f"downloads/{demo['slug']}.html"
            actions = (f'<a class="button secondary" href="{file}">Open '
                       f'<span class="sr-only">{esc(demo["title"])}</span></a>'
                       f'<a class="button" href="{file}" download>Download HTML '
                       f'<span class="sr-only">for {esc(demo["title"])}</span></a>')
        rows.append(f'<li class="demo"><span class="code">{demo["id"]}</span>'
                    f'<div><h2>{esc(demo["title"])}</h2><p>{esc(demo["question"])}</p></div>'
                    f'<div class="actions">{actions}</div></li>')
    empty = ('<p class="notice"><strong>The collection is being built.</strong> '
             'No visualizations are available yet. The topics below are planned.</p>'
             if not ready else f'<p class="notice">{ready} visualizations ready to explore.</p>')
    theme = (root / "src/shared/theme.css").read_text(encoding="utf-8")
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Interactive {esc(data['subject'].lower())} learning tools for MBA classmates. Single-file browser downloads.">
<title>{esc(data['subject'])} | MBA Interactive Learning Lab</title><link rel="icon" href="data:,"><style>{theme}</style></head>
<body><a class="skip" href="#topics">Skip to visualizations</a>
<header><p class="eyebrow">MBA INTERACTIVE LEARNING LAB</p><h1>{esc(data['subject'])}, made visible.</h1>
<p class="intro">Change an assumption. See what happens. Understand why.</p>
<p>Browser-based learning tools for classmates. No account, installation, or coding needed.</p></header>
<main><section class="instructions" aria-labelledby="how"><h2 id="how">One file. Open it anywhere.</h2>
<ol><li>Choose a visualization and select <strong>Download HTML</strong>.</li>
<li>Find the <strong>.html</strong> file in your Downloads folder.</li>
<li>Double-click it to open in your browser. After downloading, it works offline.</li></ol>
<p>You can also select <strong>Open</strong> to try a finished visualization online. A laptop is recommended for interactive diagrams.</p>
<details><summary>Need help opening a file?</summary><p>Keep the .html extension. If it opens in an editor, right-click the file and choose Open With, then your browser.
If the download opens in a tab, use your browser’s Save page option. On a phone, use the online Open button; downloaded HTML handling varies by device.</p></details></section>
<section id="topics" aria-labelledby="topics-title"><div class="section-heading"><h2 id="topics-title">Explore the topics</h2>
<p>{ready} of {len(data['demos'])} available</p></div>{empty}<ul class="demo-list">{''.join(rows)}</ul></section>
</main><footer><p>A student-created learning project. Examples will be labeled with their assumptions.</p>
<p><a href="{esc(data['sibling_repository'])}">{esc(data['sibling_subject'])} collection on GitHub</a> ·
<a href="{esc(data['repository'])}">Project source</a></p></footer></body></html>
'''


def outputs(root):
    data = read_catalog(root)
    files = {Path("docs/index.html"): render_catalog(root, data), Path("docs/.nojekyll"): ""}
    for demo in data["demos"]:
        if demo["status"] == "ready":
            files[Path(f"docs/downloads/{demo['slug']}.html")] = render_demo(root, demo)
    return data, files


def run_checks(root, data):
    subprocess.run([sys.executable, "-m", "unittest", "discover", "-s", "tests",
                    "-p", "test_*.py"], cwd=root, check=True)
    for path in sorted((root / "src").rglob("*.js")):
        subprocess.run(["node", "--check", str(path)], cwd=root, check=True)
    model_tests = sorted((root / "tests").glob("*.test.cjs"))
    if model_tests:
        subprocess.run(["node", "--test", *map(str, model_tests)], cwd=root, check=True)
    print(f"Checked {len(data['demos'])} catalog entries; "
          f"{sum(d['status'] == 'ready' for d in data['demos'])} ready demos. "
          "Browser and content review remain separate release checks.")


def main():
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument("command", choices=("build", "check", "preview"))
    args.add_argument("slug", nargs="?", help="Demo slug for development preview")
    parsed = args.parse_args()
    command = parsed.command
    if command == "preview":
        data = read_catalog(ROOT)
        demo = next((d for d in data["demos"] if d["slug"] == parsed.slug), None)
        if demo is None:
            raise ValueError("preview requires an existing catalog slug")
        content = render_demo(ROOT, demo, require_evidence=False)
        destination = ROOT / ".preview" / f"{demo['slug']}.html"
        destination.parent.mkdir(exist_ok=True)
        destination.write_text(content, encoding="utf-8")
        print(f"Development preview only: {destination}")
        return
    if parsed.slug:
        raise ValueError("Only preview accepts a slug")
    data, files = outputs(ROOT)
    # Reject leftover/unregistered public files rather than silently deleting work.
    allowed = {p.as_posix() for p in files}
    allowed.add("docs/downloads/.gitkeep")
    for path in (ROOT / "docs").rglob("*"):
        if path.is_file() and path.relative_to(ROOT).as_posix() not in allowed:
            raise ValueError(f"Unregistered public file: {path.relative_to(ROOT)}")
    if command == "build":
        for path, content in files.items():
            destination = ROOT / path
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_text(content, encoding="utf-8")
        print(f"Built {len(files)} files; ready demos only are distributed.")
    else:
        for path, content in files.items():
            destination = ROOT / path
            if not destination.is_file() or destination.read_text(encoding="utf-8") != content:
                raise ValueError(f"Stale/missing {path}; run python3 scripts/manage.py build")
        run_checks(ROOT, data)


if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, OSError, subprocess.CalledProcessError) as error:
        print(f"ERROR: {error}", file=sys.stderr)
        sys.exit(1)
