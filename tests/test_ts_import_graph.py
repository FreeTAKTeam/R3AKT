import importlib.util
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "architecture" / "ts_import_graph.py"
spec = importlib.util.spec_from_file_location("ts_import_graph", SCRIPT)
ts_import_graph = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ts_import_graph)

FIXTURE = {
    "web/src/main.ts": "import App from './App.vue'\nimport { createApp } from 'vue'\n",
    "web/src/App.vue": "<script setup lang=\"ts\">\nimport { useTasks } from './stores/tasks'\n</script>\n",
    "web/src/stores/tasks.ts": (
        "import type { Task } from '../types/task'\n"
        "import {\n  send,\n} from '@acme/client'\n"
        "import { helper } from './helper'\n"
        "import { gone } from '../missing'\n"
        "import { x } from '@/stores/x'\n"
        "const m = await import(name)\n"
        "const v = await import('../views/TaskView.vue')\n"
    ),
    "web/src/stores/helper.ts": "export const helper = 1\n",
    "web/src/types/task.ts": "export * from './shared.js'\n",
    "web/src/types/shared.ts": "export type Shared = string\n",
    "web/src/views/TaskView.vue": "<script>\nimport '../stores/tasks'\nimport './view.css'\nconst s = \"see import 'x' and import (y)\"\n</script>\n",
    "web/src/views/view.css": "",
    "web/src/views/TaskView.test.ts": "import TaskView from './TaskView.vue'\nimport '../types/task'\n",
    "client/src/index.ts": "export const send = () => 0\n",
    "web/tests/tasks.test.ts": "import { useTasks } from '../src/stores/tasks'\nconst m = await import('/src/stores/tasks.ts')\n",
}


class TestTsImportGraph(unittest.TestCase):
    def test_fixture_graph(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for rel, text in FIXTURE.items():
                (root / rel).parent.mkdir(parents=True, exist_ok=True)
                (root / rel).write_text(text, encoding="utf-8")
            g = ts_import_graph.build(root, "test/graph", ["web/src", "client/src"], ["web/tests"],
                                      {"@acme/client": "client/src"}, commit="abc")

        self.assertEqual(g["schema"], "test/graph")
        self.assertEqual(g["source"]["commit"], "abc")
        ids = [c["id"] for c in g["components"]]
        self.assertEqual(ids, ["client/src", "web/src", "web/src/stores", "web/src/types",
                               "web/src/views", "web/tests"])
        edges = {(e["from"], e["to"], e["kind"]) for e in g["edges"]}
        self.assertEqual(edges, {
            ("web/src", "web/src/stores", "import"),
            ("web/src/stores", "web/src/types", "type-import"),
            ("web/src/stores", "client/src", "import"),
            ("web/src/stores", "web/src/views", "dynamic-import"),
            ("web/src/views", "web/src/stores", "import"),
            ("web/src/views", "web/src/types", "test-import"),
            ("web/tests", "web/src/stores", "test-import"),
        })
        multiline = next(e for e in g["edges"] if e["to"] == "client/src")
        self.assertEqual(multiline["evidence"][0]["line"], 2)
        reasons = sorted((u["reason"], u["kind"]) for u in g["unresolved"])
        self.assertEqual(reasons, [("computed module specifier", "dynamic-import"),
                                   ("file not found", "import"),
                                   ("root-absolute specifier; bundler root not known", "test-dynamic-import"),
                                   ("unconfigured alias; pass --alias", "import")])
        limits = " ".join(g["source"]["limitations"])
        self.assertIn("1 third-party import statements to 1 packages not modelled: vue", limits)
        self.assertIn("4 intra-component imports not shown in the DSM; 1 asset imports", limits)


if __name__ == "__main__":
    unittest.main()
