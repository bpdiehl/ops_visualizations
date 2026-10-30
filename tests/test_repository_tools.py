"""Packaging regressions; these are not tests of any finance/operations model."""
import importlib.util
import json
import shutil
import subprocess
import sys
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("manage", Path(__file__).resolve().parents[1] / "scripts/manage.py")
manage = importlib.util.module_from_spec(spec)
spec.loader.exec_module(manage)


class PackagingTests(unittest.TestCase):
    def test_runtime_dependencies_are_rejected(self):
        fragments = [
            '<script src="https://example.com/lib.js"></script>',
            '<script>fetch("data.json")</script>', '<style>@import "theme.css";</style>',
            '<link rel="icon" href="favicon.ico">',
            '<img src="local.png">', '<style>p{background:url(local.png)}</style>',
            '<script type="module">import x from "./model.js";</script>',
            '<iframe srcdoc="hello"></iframe>', '<script>new WebSocket("wss://example.com")</script>',
            '<svg><use href="icons.svg#play"/></svg>',
        ]
        for fragment in fragments:
            with self.subTest(fragment=fragment), self.assertRaises(ValueError):
                manage.validate_offline('<!doctype html><html>' + fragment + '</html>')

    def test_embedded_assets_and_optional_web_links_are_allowed(self):
        manage.validate_offline('<!doctype html><html><style>p{color:blue}</style>'
                                '<svg><use href="#shape"/></svg>'
                                '<script>globalThis.answer=42;</script>'
                                '<p>Important input</p><a href="https://example.com">Reference</a></html>')

    def fixture(self, root):
        for folder in ("src/shared", "src/example", "specs", "tests", "verification"):
            (root / folder).mkdir(parents=True, exist_ok=True)
        (root / "src/shared/theme.css").write_text('body{color:black}', encoding="utf-8")
        (root / "specs/example.md").write_text('Example brief', encoding="utf-8")
        demo = {"id": "F1", "slug": "example", "title": "Example", "question": "What changes?",
                "status": "planned", "wave": 1}
        data = {"subject": "Finance", "repository": "https://github.com/example/finance",
                "sibling_repository": "https://github.com/example/ops", "sibling_subject": "Operations",
                "demos": [demo]}
        return data, demo

    def test_planned_demo_does_not_get_a_download(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            data, demo = self.fixture(root)
            (root / "catalog.json").write_text(json.dumps(data), encoding="utf-8")
            _, files = manage.outputs(root)
            self.assertEqual(set(files), {Path('docs/index.html'), Path('docs/.nojekyll')})
            self.assertNotIn('href="downloads/', files[Path('docs/index.html')])

    def test_ready_demo_bundles_and_requires_evidence(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            data, demo = self.fixture(root)
            demo['status'] = 'ready'
            source = root / 'src/example'
            (source / 'page.html').write_text('<!doctype html><html><style>{{STYLES}}</style>'
                                             '<script>{{MODEL}}</script><script>{{APP}}</script></html>', encoding="utf-8")
            for name in ('styles.css', 'model.js', 'app.js'):
                (source / name).write_text('/* fixture */', encoding="utf-8")
            preview = manage.render_demo(root, demo, require_evidence=False)
            self.assertIn('body{color:black}', preview)
            with self.assertRaises(ValueError):
                manage.render_demo(root, demo)
            (root / 'tests/example.test.cjs').write_text('// Test fixture', encoding="utf-8")
            (root / 'verification/example.md').write_text('Fixture only', encoding="utf-8")
            output = manage.render_demo(root, demo)
            self.assertNotIn('{{', output)
            self.assertIn('body{color:black}', output)

    def test_duplicate_ids_and_path_traversal_are_rejected(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            data, demo = self.fixture(root)
            for change in ('duplicate', 'unsafe'):
                bad = json.loads(json.dumps(data))
                if change == 'duplicate':
                    bad['demos'].append(dict(demo))
                else:
                    bad['demos'][0]['slug'] = '../private'
                (root / 'catalog.json').write_text(json.dumps(bad), encoding="utf-8")
                with self.subTest(change=change), self.assertRaises(ValueError):
                    manage.read_catalog(root)


    def test_cli_preview_build_and_stale_output(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            data, demo = self.fixture(root)
            demo['status'] = 'draft'
            (root / 'scripts').mkdir()
            shutil.copyfile(Path(manage.__file__), root / 'scripts/manage.py')
            source = root / 'src/example'
            (source / 'page.html').write_text('<!doctype html><html><style>{{STYLES}}</style>'
                                             '<script>{{MODEL}}</script><script>{{APP}}</script></html>', encoding="utf-8")
            for name in ('styles.css', 'model.js', 'app.js'):
                (source / name).write_text('/* fixture */', encoding="utf-8")
            (root / 'catalog.json').write_text(json.dumps(data), encoding="utf-8")

            def run(*args):
                return subprocess.run([sys.executable, str(root / 'scripts/manage.py'), *args],
                                      cwd=root, capture_output=True, text=True)

            self.assertEqual(run('preview', 'example').returncode, 0)
            self.assertTrue((root / '.preview/example.html').is_file())
            self.assertFalse((root / 'docs/downloads/example.html').exists())
            self.assertEqual(run('build').returncode, 0)
            catalog = root / 'docs/index.html'
            original = catalog.read_text(encoding="utf-8")
            catalog.write_text(original + '<!-- stale -->', encoding="utf-8")
            result = run('check')
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('Stale/missing', result.stderr)
            self.assertEqual(run('build').returncode, 0)
            self.assertEqual(catalog.read_text(encoding="utf-8"), original)
            extra = root / 'docs/unregistered.html'
            extra.write_text('do not delete', encoding="utf-8")
            result = run('build')
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('Unregistered public file', result.stderr)
            self.assertEqual(extra.read_text(encoding="utf-8"), 'do not delete')


if __name__ == '__main__':
    unittest.main()
