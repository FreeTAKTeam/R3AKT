#!/usr/bin/env python3
"""Extract a component dependency graph from TypeScript/Vue imports (stdlib only).

A component is a source directory plus its first sub-directory, e.g. `ui/src/stores`;
files directly in a source directory belong to the source directory itself.
`from` depends on `to`. Imports that cannot be resolved go to `unresolved`, never dropped.
Third-party package imports are summarised in `source.limitations` (not modelled as edges).

The output schema id is supplied with --schema so this script stays tool-neutral.

    python3 scripts/architecture/ts_import_graph.py --root <repo> --schema <id> \
        --source ui/src --test-source ui/tests --alias @app/client=packages/client/src \
        --commit <sha> --out graph.json
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

EXTS = (".ts", ".tsx", ".vue", ".js", ".mjs")
SKIP_DIRS = {"node_modules", "dist", "build", ".git"}
# shortcut: regex over the whole file, so imports inside comments/strings also count;
# upgrade to a real TS parser if that ever skews a result.
# Static imports must start a line, so prose like "... import" in a string is not read.
STATIC = re.compile(r"^[ \t]*(import|export)\s+(type\s+)?[^'\"();]*?\bfrom\s*['\"]([^'\"\n]+)['\"]", re.S | re.M)
SIDE_EFFECT = re.compile(r"^[ \t]*import\s*['\"]([^'\"\n]+)['\"]", re.M)
DYNAMIC = re.compile(r"(?<![\w.$])import\(\s*(['\"`]?)([^'\"`)]*)")
TEST_FILE = re.compile(r"\.(test|spec)\.[cm]?[jt]sx?$")


def line_of(text: str, pos: int) -> int:
    return text.count("\n", 0, pos) + 1


def imports(text: str):
    """Yield (specifier or None, kind, line, detail)."""
    for m in STATIC.finditer(text):
        kind = "type-import" if m.group(2) else "import"
        yield m.group(3), kind, line_of(text, m.start()), " ".join(m.group(0).split())[:160]
    for m in SIDE_EFFECT.finditer(text):
        yield m.group(1), "import", line_of(text, m.start()), m.group(0)
    for m in DYNAMIC.finditer(text):
        quote, spec = m.group(1), m.group(2).strip()
        literal = quote in ("'", '"') or (quote == "`" and "${" not in spec)
        yield (spec if literal else None), "dynamic-import", line_of(text, m.start()), m.group(0)[:160]


def resolve(base: Path, spec: str):
    target = (base / spec).resolve()
    candidates = [target] + [target.with_name(target.name + e) for e in EXTS]
    if target.suffix == ".js":  # ESM TypeScript writes `./x.js` for `./x.ts`
        candidates.append(target.with_suffix(".ts"))
    candidates += [target / ("index" + e) for e in EXTS]
    return next((c for c in candidates if c.is_file()), None)


def build(root: Path, schema: str, sources, test_sources, aliases, commit=None) -> dict:
    root = root.resolve()
    all_sources = [(s.strip("/"), False) for s in sources] + [(s.strip("/"), True) for s in test_sources]

    def component(path: Path):
        if not path.is_relative_to(root):
            return None, False
        rel = path.relative_to(root).as_posix()
        for src, is_test in all_sources:
            if rel.startswith(src + "/"):
                rest = rel[len(src) + 1:].split("/")
                return (src if len(rest) == 1 else f"{src}/{rest[0]}"), is_test
        return None, False

    files = []
    for src, _ in all_sources:
        for dirpath, dirnames, filenames in os.walk(root / src):
            dirnames[:] = sorted(d for d in dirnames if d not in SKIP_DIRS)
            files += [Path(dirpath) / f for f in sorted(filenames)
                      if f.endswith(EXTS) and not f.endswith(".d.ts")]

    components, edges, unresolved, third_party, intra, assets = {}, {}, [], {}, 0, 0
    for f in files:
        comp, is_test = component(f)
        components.setdefault(comp, f.relative_to(root).as_posix())
    for f in files:
        comp, is_test = component(f)
        rel = f.relative_to(root).as_posix()
        is_test = is_test or bool(TEST_FILE.search(f.name))
        text = f.read_text(encoding="utf-8", errors="replace")
        for spec, kind, line, detail in imports(text):
            kind = "test-" + kind if is_test else kind
            ev = {"location": rel, "line": line, "detail": detail}
            if spec is None:
                unresolved.append({"from": comp, "target": detail, "kind": kind,
                                   "reason": "computed module specifier", "evidence": [ev]})
                continue
            alias = next((a for a in aliases if spec == a or spec.startswith(a + "/")), None)
            if alias:
                target = resolve(root, aliases[alias] + spec[len(alias):])
            elif spec.startswith("/"):
                unresolved.append({"from": comp, "target": spec, "kind": kind,
                                   "reason": "root-absolute specifier; bundler root not known", "evidence": [ev]})
                continue
            elif spec.startswith("."):
                target = resolve(f.parent, spec)
            else:
                pkg = "/".join(spec.split("/")[:2]) if spec.startswith("@") else spec.split("/")[0]
                third_party[pkg] = third_party.get(pkg, 0) + 1
                continue
            if target and not target.name.endswith(EXTS):
                assets += 1  # .css/.svg/.png and similar are not components
                continue
            to = component(target)[0] if target else None
            if to is None:
                reason = "file not found" if target is None else "target outside analysed sources"
                unresolved.append({"from": comp, "target": spec, "kind": kind, "reason": reason, "evidence": [ev]})
                continue
            if to == comp:
                intra += 1
                continue
            edges.setdefault((comp, to, kind), []).append(ev)

    limitations = [
        "regex extraction: imports in comments or strings are counted; require() and CSS imports are not read",
        "*.test.*/*.spec.* files and --test-source directories give test-* edge kinds",
        f"{intra} intra-component imports not shown in the DSM; {assets} asset imports (css, images) not modelled",
        f"{sum(third_party.values())} third-party import statements to {len(third_party)} packages not modelled: "
        + ", ".join(sorted(third_party)),
    ]
    source = {"extractor": "ts-imports", "dirty": False,
              "settings": {"sources": ",".join(sources), "test_sources": ",".join(test_sources),
                           "aliases": ",".join(f"{k}={v}" for k, v in sorted(aliases.items()))},
              "limitations": limitations}
    if commit:
        source["commit"] = commit
    return {
        "schema": schema,
        "source": source,
        "components": [{"id": c, "kind": "module", "location": loc} for c, loc in sorted(components.items())],
        "edges": [{"from": a, "to": b, "kind": k, "evidence": ev} for (a, b, k), ev in sorted(edges.items())],
        "unresolved": unresolved,
    }


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--root", required=True, type=Path)
    p.add_argument("--schema", required=True, help="graph schema id the consuming tool expects")
    p.add_argument("--source", action="append", default=[], required=True)
    p.add_argument("--test-source", action="append", default=[])
    p.add_argument("--alias", action="append", default=[], help="SPEC=DIR (DIR relative to root)")
    p.add_argument("--commit")
    p.add_argument("--out", type=Path)
    a = p.parse_args(argv)
    aliases = dict(x.split("=", 1) for x in a.alias)
    graph = build(a.root, a.schema, a.source, a.test_source, aliases, a.commit)
    text = json.dumps(graph, indent=2) + "\n"
    if a.out:
        a.out.write_text(text, encoding="utf-8")
    else:
        sys.stdout.write(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
