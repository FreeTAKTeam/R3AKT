#!/usr/bin/env bash
# Report-only architecture gate for the pilot repositories (issue #12).
# Usage: pilot_gate.sh <work-dir> <out-dir>
#   <work-dir> holds checkouts named rch/, rem/ and LXMF-rs/ (REM resolves ../../../LXMF-rs).
# Needs `archgraph` on PATH. Exits 0 whatever the findings are; a bad input or a missing
# checkout fails, so a broken gate is never reported as clean.
set -euo pipefail
work=${1:?work dir}; out=${2:?out dir}
here=$(cd "$(dirname "$0")/../.." && pwd)
policies=$here/docs/architecture/assessment-2026-11-28/policies
extract=$here/scripts/architecture/ts_import_graph.py
mkdir -p "$out"

commit() { git -C "$1" rev-parse HEAD 2>/dev/null || echo unknown; }
validate() {
  local name=$1; shift
  archgraph validate --policy "$policies/$name.policy.json" "$@" \
    --out "$out/$name.json" --sarif "$out/$name.sarif"
}
ui_graph() {
  local name=$1 root=$2; shift 2
  python3 -I "$extract" --root "$root" --schema archgraph/graph/v1 --commit "$(commit "$root")" \
    --out "$out/$name.graph.json" "$@"
}

validate rch-rust --cargo-manifest "$work/rch/Cargo.toml"
ui_graph rch-ui "$work/rch" --source ui/src --test-source ui/tests --test-source ui/e2e
validate rch-ui --graph "$out/rch-ui.graph.json"

validate rem-rust --cargo-manifest "$work/rem/crates/reticulum_mobile/Cargo.toml" \
  --external 'lxmf*' --external 'reticulum*' --external 'r3akt*' --external rpp-core
ui_graph rem-ui "$work/rem" --source apps/mobile/src --source packages/node-client/src --test-source e2e
validate rem-ui --graph "$out/rem-ui.graph.json"

validate lxmf-rs --cargo-manifest "$work/LXMF-rs/Cargo.toml"
