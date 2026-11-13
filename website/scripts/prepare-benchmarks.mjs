import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const directory = new URL("../public/benchmarks/", import.meta.url);
const file = "lxmf-fair-2026-11-01.json";
const expected = "fd9272b5452c9cb3e42750db4c18df2fcc615e4905d43aaa97a06c54dc5ed45c";
const raw = readFileSync(new URL(file, directory));
const sha256 = createHash("sha256").update(raw).digest("hex");
if (sha256 !== expected) throw Error(`Benchmark asset digest mismatch: ${file}`);

const current = JSON.parse(raw);
const metrics = row => ({ p50: row.p50_ns, p95: row.p95_ns, p99: row.p99_ns, throughput: row.throughput_ops_per_sec });
const rows = current.comparisons.map(row => ({ label: row.label, rust: metrics(row.rust), python: metrics(row.python) }));
writeFileSync(new URL("../app/benchmark-data.json", import.meta.url), JSON.stringify({ rows }, null, 2) + "\n");
writeFileSync(new URL("provenance.json", directory), JSON.stringify({
  current: { repository: "FreeTAKTeam/LXMF-rs", tag: "v0.16.1", path: "docs/performance/main-2026-11-01.json", file, measurementCommit: current.environment.git_commit, sha256 },
}, null, 2) + "\n");
console.log(`Verified benchmark dataset; prepared ${rows.length} corrected comparisons.`);
