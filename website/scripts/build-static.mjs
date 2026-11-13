import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { build, createServer } from "vite";

await build();
const server = await createServer({ server: { middlewareMode: true, watch: null, ws: false } });
try {
  const { render } = await server.ssrLoadModule("/app/render.tsx");
  const entry = new URL("../dist/index.html", import.meta.url);
  const html = await readFile(entry, "utf8");
  const marker = "<!--r3akt-prerender-->";
  if (!html.includes(marker)) throw new Error("Prerender slot is missing from the Vite output");
  await writeFile(entry, html.replace(marker, () => render()));
  await writeFile(new URL("../dist/.nojekyll", import.meta.url), "");
} finally {
  await server.close();
}

const fontLicenses = new URL("../dist/licenses/", import.meta.url);
await mkdir(fontLicenses, { recursive: true });
for (const [name, packageName] of [
  ["barlow", "@fontsource/barlow"],
  ["jetbrains-mono", "@fontsource-variable/jetbrains-mono"],
  ["orbitron", "@fontsource-variable/orbitron"],
]) {
  await copyFile(new URL(`../node_modules/${packageName}/LICENSE`, import.meta.url), new URL(`${name}.txt`, fontLicenses));
}
