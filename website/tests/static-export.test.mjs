import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { normalizeBase } from "../scripts/pages-base.mjs";

const root = path.resolve("dist");
const html = readFileSync(path.join(root, "index.html"), "utf8");
const notFound = readFileSync(path.join(root, "404.html"), "utf8");
const base = normalizeBase(process.env.PAGES_BASE_PATH);

test("export includes meaningful content before JavaScript runs", () => {
  for (const text of ["LXMF-rs", "Rust RNS", "Our RNS implementation.", "v0.16.1", "v0.16.2-rc.1", "Put the stack", "Reticulum packet pack", "goTenna", "ATN BinoX", "REM Watch Status plugin", "Drone control over Reticulum", "v1.0.0-beta.3", "Amazfit T-Rex 2", "1.6.2", "preview.38", "In development"]) assert.ok(html.includes(text), `Missing ${text}`);
  assert.ok(!html.includes('name="codex-preview"'));
  assert.ok(existsSync(path.join(root, ".nojekyll")));
});

test("both pages and CSS reference only existing files under the configured base", () => {
  const resolveAsset = url => {
    assert.ok(url.startsWith(base), `Missing base path: ${url}`);
    const relative = decodeURIComponent(url.slice(base.length).split(/[?#]/)[0]);
    const file = path.resolve(root, relative || "index.html");
    assert.ok(file.startsWith(root + path.sep), `Asset escapes the export: ${url}`);
    assert.ok(existsSync(file), `Missing file: ${url}`);
    return file;
  };
  const urls = [...(html + notFound).matchAll(/(?:src|href)="(\/(?!\/)[^"#]*)"/g)].map(match => match[1]);
  assert.ok(urls.length > 5);
  const files = urls.map(resolveAsset);
  const stylesheets = files.filter(file => file.endsWith(".css"));
  assert.ok(stylesheets.length);
  let fonts = 0;
  for (const sheet of stylesheets) {
    for (const [, url] of readFileSync(sheet, "utf8").matchAll(/url\(["']?(\/(?!\/)[^)"']+)["']?\)/g)) {
      resolveAsset(url);
      if (/\.woff2?$/.test(url)) fonts++;
    }
  }
  assert.ok(fonts, "The built CSS must reference bundled fonts");
  assert.ok(notFound.includes(`href="${base}"`), "404 must link back to the deployed home");
});

test("page anchors have corresponding targets", () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(match[1]), `Missing #${match[1]}`);
});

test("the export charts the corrected measurements and serves only the current benchmark files", () => {
  const current = JSON.parse(readFileSync(path.join(root, "benchmarks/lxmf-fair-2026-11-01.json"), "utf8"));
  const chart = JSON.parse(readFileSync("app/benchmark-data.json", "utf8"));
  const source = current.comparisons;
  assert.equal(chart.rows.length, source.length);
  chart.rows.forEach((row, index) => {
    assert.equal(row.label, source[index].label);
    for (const side of ["rust", "python"]) {
      for (const metric of ["p50", "p95", "p99"]) assert.equal(row[side][metric], source[index][side][`${metric}_ns`]);
      assert.equal(row[side].throughput, source[index][side].throughput_ops_per_sec);
    }
  });
  assert.equal([...html.matchAll(/class="benchmark-row"/g)].length, source.length);
  const files = readdirSync(path.join(root, "benchmarks"), { recursive: true, withFileTypes: true }).filter(entry => entry.isFile());
  assert.deepEqual(files.map(entry => entry.name).sort(), [
    "LXMF-rs-LICENSE.txt", "lxmf-fair-2026-11-01.json", "provenance.json",
  ].sort());
});
