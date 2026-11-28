# Architecture analysis pilot: RCH, REM and LXMF-rs (2026-11-28)

Baseline dependency analysis of three existing R3AKT civilian software projects, as a
second independent case for the DAF/Aphrodites architecture research
(FreeTAKTeam/DigitalArchitectureFramework#7). Issue: #12.

**Report only.** The three subject repositories were read at pinned revisions from
exported copies. Nothing in them was changed, built in place or reconfigured. No
operational capability was touched. Every change proposed at the end needs separate
approval.

## Contents

| Path | What |
| --- | --- |
| `README.md` | Method, metric definitions, baselines, comparison, FR→DP samples, concept/synchronization trial, proposals |
| `rch/`, `rem/`, `lxmf-rs/` | Per-graph CSVs: `*-dsm.csv` (sorted by id), `*-dsm-reordered.csv` (providers first, cycles as blocks), `*-components.csv` (fan-in/out, cluster), `*-layers.csv` (cohesion and coupling per policy layer, with denominators), `*-findings.csv` (validator findings with first evidence) |
| `policies/*.policy.json` | The report-only policies used (layer guesses from each repo's own docs) |
| `../../../scripts/architecture/ts_import_graph.py` | TypeScript/Vue import extractor (stdlib only); self-test in `tests/test_ts_import_graph.py` |

## Method

Tools:

- **Analyzer and validator:** a private dependency-analysis tool (DSM/SCC/policy
  validator). It reads a language-neutral component graph (components, directed edges
  with evidence, unresolved dependencies) and writes the DSM, clusters, metrics and
  policy findings. Its raw JSON/SARIF output is not committed; the CSVs here are taken
  from it, and the policies are committed with the schema id replaced by
  `@POLICY_SCHEMA@`.
- **Rust:** `cargo metadata --no-deps --offline --format-version 1` in each exported
  workspace (all three succeeded offline). Components are workspace crates; edges are
  declared manifest dependencies (`normal`, `build`, `dev`).
- **TypeScript/Vue:** `scripts/architecture/ts_import_graph.py`. A component is a source
  directory plus its first sub-directory (`ui/src/stores`); files directly in the source
  directory form the root component (`ui/src`). Static, type-only and literal dynamic
  imports become edges; `*.test.*`/`*.spec.*` files and test directories give `test-*`
  edge kinds. Computed and root-absolute specifiers go to `unresolved`; third-party,
  asset and intra-component imports are counted in the graph's limitations.

Reproduce (paths relative to each exported repository; `<tool>` is the analyzer):

```bash
git -C <repo> archive <pinned-sha> | tar -x -C <export>
# Rust
cargo metadata --no-deps --offline --format-version 1 > meta.json
<tool> analyze --metadata-json meta.json --kinds normal,build --policy <policy> --out-dir <out>
# REM's crate adds: --external 'lxmf*' --external 'reticulum*' --external 'r3akt*' --external rpp-core
# TypeScript/Vue (graph schema id of the tool passed in, not stored here)
python3 scripts/architecture/ts_import_graph.py --root <export> --schema <graph-schema-id> \
  --source ui/src --test-source ui/tests --test-source ui/e2e --commit <sha> --out graph.json
<tool> analyze --graph graph.json --kinds import,type-import,dynamic-import --policy <policy> --out-dir <out>
# Validation, report-only (exit 0)
<tool> validate (--graph graph.json | --metadata-json meta.json) --policy <policy> --today 2026-11-28 --out v.json
```

REM's crate resolves `../../../LXMF-rs` path dependencies; the export of LXMF-rs at its
pin was placed beside it, so the two pins were analysed together.

## Metric definitions

| Metric | Meaning |
| --- | --- |
| Component | A Rust workspace crate, an external crate kept on purpose (REM), or a TS/Vue source directory |
| Dependency pair | Ordered pair (*a*, *b*) where *a* depends on *b* through at least one edge of the selected kinds. Several imports between the same two components count once |
| Runtime kinds | Rust `normal` + `build`; TS `import`, `type-import`, `dynamic-import`. Dev/test kinds are reported separately |
| DSM | Row *a*, column *b* is marked (with edge kinds) when *a* depends on *b* |
| Density | pairs / n(n−1) |
| Cycle | A strongly connected component with more than one member. An acyclic graph reorders into a lower-triangular DSM |
| Level | Dependency depth of a cluster (0 = depends on nothing inside the graph) |
| Fan-in / fan-out | Number of components depending on / depended on by a component |
| Layer cohesion | Internal pairs / k(k−1) for a layer of k members; undefined (blank) when k = 1 |
| Layer coupling | Crossing pairs / 2k(n−k) |
| Layer-order finding | A runtime edge from a lower to a higher policy layer (layer 0 lowest) |
| Unresolved | A dependency whose target could not be determined. Reported, never dropped or read as absent |
| FR→DP cell | `x` affects, `0` reviewed with evidence of no effect, `?` unknown. A matrix with any `?` stays unclassified |

All ratios keep their numerator and denominator in the CSVs; a value is blank when the
denominator is zero.

## Pinned revisions and coverage

| Repo | Pinned `origin/main` | Commit date | Analysed | Not analysed |
| --- | --- | --- | --- | --- |
| Reticulum-Community-Hub (RCH) | `ad2e2e0a80e171a3fc195aea96b6b195803cd5da` | 2026-11-26 | 11 workspace crates (254 of 256 `.rs` files); `ui/src` 224 TS/Vue/JS files + 39 test files | `apps/rch-desktop/src-tauri` (not a workspace member, 2 `.rs`); 26 Python scripts under `scripts/` (tooling, no extractor run); 5 UI config files |
| reticulum_mobile_emergency_management (REM) | `8bcfdd3d4a656b70c4ef958f621a3f0a24ccca0f` | 2026-11-27 | crate `reticulum_mobile` and its 11 direct workspace-path/git dependencies; `apps/mobile/src` + `packages/node-client/src` 292 files + 24 `e2e` files | Module structure inside the single 340-file crate (crate-level only); `tools/uniffi-bindgen`; `plugins/*` (3 files); `tools/*.mjs` (4); root `stitch_*.js` |
| LXMF-rs (Fabric) | `a1492c12ede4e463b8127d3e6a459a504dd52aae` | 2026-11-27 | 25 workspace crates | `vendor/zeromq` (path dependency outside members: 2 unresolved edges); `tools/*`, `examples/*` crates outside the workspace; 132 Python files (interop/fixtures) |

Rust graphs read declared manifest dependencies, so an unused declared dependency still
counts and source-level use is not checked. The TS extractor is regex-based: imports in
comments or strings can count, `require()` and CSS `@import` are not read.

## Baselines

### RCH

**Rust workspace** (`rch/rust-*`): 11 crates, 23 runtime pairs (density 23/110 = 0.209),
6 levels, **0 cycles** (dev included: still 23 pairs, 0 cycles), 0 unresolved. Highest
fan-in `r3akt-protocol` (6); highest fan-out `r3akt-rch-server` (7). Layers
(contracts → shared-domain → hub-core → adapters → hosts): **0 findings**, including the
`tak-independent-of-server` rule taken from `docs/examples.md`. Coupling per layer is
in `rch/rust-layers.csv` (for example hub-core 7/20 = 0.35).

**Web UI** (`rch/ui-*`): 11 components, 30 runtime pairs (0.273), 36 with test edges,
**1 cycle of 4**: `ui/src/api`, `ui/src/composables`, `ui/src/stores`, `ui/src/utils`.
Highest fan-in `ui/src/api` (7). Findings (report-only): 1 error (the cycle), 3 warnings:

- `ui/src/api → ui/src/stores` (layer order and the `transport-not-on-store` rule):
  `api/client.ts:1` and `api/ws.ts:2` import the connection store. The repository's own
  frontend principles already name this transport-to-store coupling as known debt.
- `ui/src/utils → ui/src/api` (layer order): for example `utils/checklist-create.ts:1`
  imports `api/endpoints`, and `utils/event-feed.ts` imports API types.

197 intra-component imports, 404 third-party imports (11 packages) and 5 asset imports
were seen but are not DSM edges.

### REM

**Rust** (`rem/rust-*`): one crate, `reticulum_mobile`, with 11 direct dependencies kept
as external components: 6 LXMF-rs crates through relative `../../../LXMF-rs` paths,
3 RCH crates through git at **two different revisions** (`r3akt-map-core` and
`r3akt-profile-rch` at `82f72e9`, `r3akt-library-core` at `24ab5c6`), `r3akt-mesh-delivery`
from R3AKTClient by git, and the local `jni-boundary-macro`. 0 cycles, 0 findings
(layers fabric → shared-r3akt → native-boundary → mobile-runtime). The crate-level graph
cannot show the internal structure of the 340-file crate.

**Mobile UI** (`rem/ui-*`): 11 components, 34 runtime pairs (0.309), 38 with tests,
**2 cycles**:

1. `apps/mobile/src` ↔ `components` ↔ `composables` ↔ `views` (4 members). Edges inside
   it: `components/AppToolsMenu.vue:5` imports `../appNavigation` (app root);
   `composables/useSetupWizard.ts` imports non-visual helpers that live under
   `components/settings/` (`settingsFormSlices`, `sosFormDraft`, `settingsPageCopy`).
2. `services` ↔ `utils` (2 members): `utils/checklistNotifications.ts:3` imports
   `services/operationalNotifications`; `services/hubRegistryBootstrap.ts` imports
   `utils/missionSync` and `utils/r3akt`.

Findings (report-only): 2 errors (the cycles), 3 layer-order warnings (the edges named
above). Runtime unresolved: 0. Test-only unresolved: 89 (53 computed `import(moduleUrl)`
in `*.test.mjs`, 36 root-absolute `import("/src/…")` in Playwright specs).

### LXMF-rs

25 crates, 44 runtime pairs (44/600 = 0.073), 50 with dev edges, 6 levels, **0 cycles**
(runtime and dev), 2 unresolved (`lxmf-sdk` and `reticulumd` → `vendor/zeromq`). Highest
fan-in `reticulum-rs-core` (8), then `lxmf-wire` (7); highest fan-out `reticulumd` (6).
Layers (no-std-core → protocol → services → sdk-facades → apps → tooling): **0 layer
findings**, 2 notes (the unresolved edges). No crate in the `no_std_core` list depends on
a higher layer, which agrees with the repository's `forbidden_core_deps`.

**Design-time versus implementation.** LXMF-rs is the only subject with a
machine-readable design model: the strict edge allowlist in
`[workspace.metadata.boundaries]` (`allowed_library_edges` + `allowed_app_edges`, 47
edges). Compared with all declared edges: **47 matched, 0 designed-but-missing,
3 built-but-not-designed** — `xtask → lxmf-wire`, `xtask → reticulum-rs-core`,
`xtask → reticulum-rs-transport`. `tools/scripts/check-boundaries.sh` only checks
`crates/libs` and `crates/apps`, so these are outside its scope rather than
violations. RCH and REM have no machine-readable design model to compare with; that
comparison is unknown for them, not empty.

## Cross-repo comparison (runtime edges)

| Graph | Components | Pairs | Density | Levels | Cycles (members) | Unresolved | Layer-order / rule findings | Dev/test pairs added | Dev/test cycles |
| --- | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: | --- |
| RCH Rust | 11 | 23 | 23/110 = 0.209 | 6 | 0 | 0 | 0 | 0 | 0 |
| RCH UI | 11 | 30 | 30/110 = 0.273 | 6 | 1 (4) | 0 | 3 | 6 | — |
| REM Rust | 12 | 11 | 11/132 = 0.083 | 2 | 0 | 0 | 0 | 0 | 0 |
| REM UI | 11 | 34 | 34/110 = 0.309 | 4 | 2 (4, 2) | 0 (89 test-only) | 3 | 4 | — |
| LXMF-rs | 25 | 44 | 44/600 = 0.073 | 6 | 0 | 2 | 0 | 6 | 0 |
| Reference twin-host codebase (private; aggregate metrics only) | 45 crates | 200 | 200/1980 = 0.101 (derived) | — | 0 | — | 0 layer violations | — | 1 dev-dependency cycle of 5 crates |

Reading: the three Rust workspaces are acyclic at crate level, like the reference
codebase, and LXMF-rs matches its own declared allowlist except for tooling. All cycles
found are in the two Vue front ends, at directory level, and each is explained by a few
named imports. Densities are only comparable between graphs of similar size and the same
granularity (crates versus directories).

## FR→DP samples (only where evidence exists)

| Repo | FR | DP | Cells | Result |
| --- | --- | --- | --- | --- |
| RCH | FR1 encode/decode mission messages; FR2 apply checklist task status and recompute | DP1 `r3akt-protocol`; DP2 `r3akt-rch-core` (`set_checklist_task_status`) | FR1/DP1 x, FR2/DP2 x, FR1/DP2 0 (protocol has fan-out 0), FR2/DP1 ? (declared dependency, use not analysed) | **unknown** (3/4 cells known) |
| REM | FR1 notify once per checklist change; FR2 send/receive LXMF through the compiled Fabric | DP1 `apps/mobile/src/utils` (`checklistNotifications.ts`); DP2 `reticulum_mobile` (`sdk_bridge.rs`) | FR1/DP1 x, FR2/DP2 x, FR2/DP1 0 (a Rust crate cannot import TS utils), FR1/DP2 ? (records arrive through the bridge; not traced) | **unknown** (3/4) |
| LXMF-rs | FR1 protocol core builds without std runtime crates; FR2 daemon serves transport and RPC | DP1 `reticulum-rs-core`; DP2 `reticulumd` | FR1/DP1 x, FR1/DP2 0 (`reticulumd` in `forbidden_core_deps`, no core→app edge), FR2/DP1 x, FR2/DP2 x | **triangular** (decoupled), order FR1 → FR2 |

Unknown cells stay unknown; they are not read as independence.

## Report-only validation and existing test results

| Check | Command (in the export or this repo) | Result |
| --- | --- | --- |
| Validator, five graphs, report-only | `validate … --today 2026-11-28` | exit 0 for all five (RCH Rust pass, RCH UI 1 error/3 warnings, REM Rust pass, REM UI 2 errors/3 warnings, LXMF-rs pass with 2 notes) |
| Blocking mode, demonstration only | REM UI with `--blocking` | exit 1 (errors present, no baseline) |
| Blocking mode with baseline | REM UI with `--blocking --baseline <report-only run>` | exit 0 (0 new findings) |
| Extractor self-test + existing R3AKT tests | `python3 -m unittest discover -s tests -t .` | 11 tests OK |
| RCH, two small crates | `cargo +1.89.0 test --offline --locked -p r3akt-protocol -p r3akt-identity` (`CARGO_BUILD_JOBS=2`, target outside the repo) | exit 0, 8 passed (6 + 2), 0 failed |
| LXMF-rs, two small crates | `cargo test --offline --locked -p rns-embedded-core -p rns-embedded-runtime` (same settings) | exit 0, 48 passed (23 + 25), 0 failed |
| RCH and REM UI tests | — | **not run**: exported copies have no `node_modules`; installing needs the network |
| REM Rust tests | — | **not run**: builds the full Fabric stack plus git dependencies |
| Full RCH / LXMF-rs suites | — | **not run**: large workspace builds; only the crates above were sampled |

RCH requires Rust 1.89 (its MSRV); the machine default 1.88 refused it, so the installed
1.89.0 toolchain was used.

## Concept/synchronization trial (design only)

DigitalRust now has a generic synchronization engine (FreeTAKTeam/DigitalRust PR #3,
merged as `bfa94ae`; `crates/digitalrust-runtime/src/synchronization.rs`). Concepts
implement `ConceptBinding` (name, action list, `decode` of input fields, `encode` of
output fields, failure codes); declarative rules react to action completions, so
concepts never call each other. The engine records each flow (`Completion` with `flow`,
`cause`, `rule`, `depth`), drops repeats through a `Ledger`, retries retryable failures
and stops chains at `Limits` (default depth 8, 256 steps). Its fixture
`tests/fixtures/checklist_notification.sync` is the chosen R3AKT flow:

```text
rule notify-team-on-completion 1
  when checklist.complete ok
  then notify.send(team=output.team, task=output.task, text="Task completed")
```

**Today in R3AKT.** RCH: `r3akt-rch-core` `set_checklist_task_status` sets the task's
user status, stamps `completed_ts_ms`/`completed_by_…`, recomputes the checklist, and a
`status_set` mission-change delta (`checklist_task_status_set_delta`) is stored and fanned
out to team members. REM: `createChecklistNotificationCoordinator`
(`apps/mobile/src/utils/checklistNotifications.ts`) debounces changes for 2 s and posts
one local notification per `uid:latestChangeStamp` through
`services/operationalNotifications`.

| Engine element | R3AKT counterpart | Fit |
| --- | --- | --- |
| concept `checklist`, action `complete` → output `team`, `task` | `set_checklist_task_status` with `user_status = COMPLETE` | Good; status is one of several values, so `complete`/`reopen` map to a status argument |
| concept `notify`, action `send`, error `no_recipients` | mission-change fan-out (RCH), local notification (REM) | Good for the event; delivery is asynchronous over the mesh, so `send ok` means "queued", not "delivered" |
| rule `notify-team-on-completion` | the coupling now inside the core command path | This is what the engine would make explicit and testable |
| rule `reopen-when-unnotified` | none: R3AKT keeps a completion when delivery fails | Leave out of an R3AKT trial |
| `Ledger` (completion id seen once) | REM's `uid:latestChangeStamp` de-duplication | Same idea; a durable ledger must commit in the same SQLite transaction as the task change (the engine's documented boundary) |
| `Fields`/`Value` (`Bool`, `Int`, `Text`) | mission-change delta: about 15 JSON fields, several nullable | Mismatch: no null, list or object values, so the delta cannot pass through unchanged |

**Isolated trial, if approved.** A test-only crate (no RCH/REM code change) with two
adapters over fixtures: `checklist` over a checklist/task fixture shaped like RCH's
records, `notify` recording sends. Assertions: one send per completion; a repeated
completion id gives `Duplicate` and no second send; an empty team gives `no_recipients`
and no state change; a depth limit stops a self-triggering rule. Regression result:
**not run**, because no trial code was written in this pass.

**Cost estimate.** The engine's own example `Checklist` and `Notify` concepts take
about 200 lines (`tests/examples/mod.rs`), and the rule file 11 lines; the runtime crate
depends only on `digitalrust-core`. An R3AKT-shaped trial is therefore about 250–350 lines
of test code plus fixtures. Production adoption is a much larger, separate decision: RCH
checklist logic sits in a 16.7k-line `lib.rs` with direct state mutation, so concepts
would need extracting, the ledger tied to the SQLite unit of work, and `Value` extended or
the delta reduced to text/int fields.

## Proposed changes and trade-offs (require separate approval)

None of these is made here. Each needs the owning repository's approval before any
refactoring or release.

| # | Repo | Proposal | Effect | Trade-off |
| --- | --- | --- | --- | --- |
| 1 | RCH UI | Pass connection/auth state into `api/client.ts` and `api/ws.ts` instead of importing the connection store (already the stated direction in its frontend principles) | Removes `api → stores`; breaks the 4-member cycle together with #2 | Touches every client construction site; do it only when that boundary is next changed |
| 2 | RCH UI | Move the API types that `utils` imports into `ui/src/types`, or move API-calling helpers such as `checklist-create.ts` out of `utils` | Removes `utils → api` | Small churn across imports |
| 3 | REM UI | Move non-visual settings helpers out of `components/settings/` (to `composables` or `utils`), and `appNavigation` beside the menu components | Removes `composables → components` and `components → src`; breaks cycle 1 | Import churn in settings views |
| 4 | REM UI | Put `checklistNotifications` with `services/operationalNotifications`, or split `utils/missionSync`/`r3akt` from service code | Breaks the `services ↔ utils` cycle | Decide which layer owns mission sync first |
| 5 | REM Rust | Pin the RCH crates at one revision; give the sibling `../../../LXMF-rs` paths a declared, reproducible source | Removes version skew between `r3akt-map-core`/`profile-rch` and `library-core` | REM's AGENTS.md keeps the local paths on purpose for development; needs a team decision |
| 6 | LXMF-rs | Either add the three `xtask` edges to the allowlist or state that tooling is out of scope | Design model and build agree fully | None functional |
| 7 | All | Run these policies as a report-only lane with a saved baseline; later block only new errors | Regressions become visible without failing existing work | Layers here are guesses from each repo's docs; owners must review them first |
| 8 | REM, RCH | Add module-level Rust extraction (REM's single crate, RCH's `r3akt-rch-core/src/lib.rs`) | Measures where most of the code actually is | New extractor work; the crate graph says nothing inside a crate |

## Skipped and limits

- Python extraction: no Python product code exists at these pins (RCH and LXMF-rs Python
  files are scripts, interop and fixtures), so no Python extractor was written.
- No visualisation; CSV is the integration point.
- Component granularity for TS is one directory level; finer cycles inside a directory
  (for example inside `components/`) are not measured.
- Policy layers are this pilot's reading of each repository's AGENTS.md and docs, not
  approved architecture.
- The reference twin-host codebase is represented by aggregate numbers only.
