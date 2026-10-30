# Maintainer guide

Classmates need only the final HTML file and a browser. Python 3 and Node.js are maintainer tools, not student requirements. There is no npm install or application server.

## Add one visualization

1. Read AGENTS.md, DESIGN.md, specs/SHARED_REQUIREMENTS.md and the relevant brief.
2. Keep its existing catalog ID/slug. Set status to draft while building; drafts stay out of downloads.
3. Create src/<slug>/ with page.html, styles.css, model.js and app.js. Copy templates/page.html as the starting page.
4. Put pure validated calculations in model.js under globalThis.DemoModel. Keep UI and animation in app.js. Put shared styles in src/shared/theme.css and recurring teaching definitions in src/shared/glossary.json as needed.
5. Create meaningful Node tests in tests/<slug>.test.cjs. Use node:vm to load model.js in a fresh context and read context.DemoModel; no browser/DOM needed. Compare to independently computed expected values, including the brief's examples, invalid input and boundaries.
6. Before setting ready, create verification/<slug>.md from templates/verification.md and complete the numerical and browser checks below. During development, run python3 scripts/manage.py preview <slug> to generate an ignored .preview/<slug>.html without changing its catalog status or claiming verification. Do not commit a ready status until review is complete.
7. Set ready, run the build and checks, and inspect the resulting diff. Record the delivered scope and version in CHANGELOG.md. Ready artifacts are committed alongside source so downloads and branch-based Pages do not need a build service.

## Commands (from repository root)

~~~sh
python3 scripts/manage.py build
python3 scripts/manage.py check
# For a demo in development: python3 scripts/manage.py preview <slug>
python3 -m http.server 8000 --directory docs --bind 127.0.0.1
~~~

Open http://127.0.0.1:8000/ for a hosted-style preview. Stop the preview server when finished. Never share a localhost URL with classmates.

The build replaces exactly one each of {{STYLES}}, {{MODEL}}, and {{APP}} in page.html. STYLES includes theme.css followed by the demo's styles.css. The scripts must be classic scripts with no imports. Do not include literal closing script/style tags inside their source files. No minification is needed initially. Keep explanatory source readable.

The check command verifies catalog entries, deterministic generated output, packaging-tool regression tests, source JS syntax and all *.test.cjs model tests. It rejects unexpected public files rather than deleting them. Review/remove obsolete generated files explicitly when retiring a demo. The checker is deliberately conservative and cannot prove offline operation or mathematical correctness by itself.

## Browser release checks

- Download from the catalog over local HTTP. Confirm the .html filename.
- Copy only that file to a fresh folder; open via file:// with network blocked. No adjacent source, catalog, or assets may be needed.
- Exercise default, every preset, Reset, input changes and invalid states. Confirm graphs and displayed numbers agree.
- Test at 360 px and laptop width; use keyboard for inputs, information controls and Escape. Check reduced motion, readable labels, browser errors and attempted requests.
- Keep optional related-concept navigation from breaking standalone use: use explicit HTTPS links only for already-live targets, or plain text. The demo must remain fully useful without following links.
- Record browser/OS, steps, date, expected/observed results, console/network findings and omissions. One browser does not prove all-browser support.

## Shared standards

Both repositories intentionally have the same small support scaffold. Change a shared rule or tool in both when that task is in scope, and run checks in both. Domain models remain independent. Neither repository needs the OneDrive folder to build. See PUBLISHING.md for the owner-run GitHub Pages setup and RIGHTS.md before licensing or publishing.
