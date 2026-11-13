import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { normalizeBase } from "./scripts/pages-base.mjs";

export default defineConfig({
  base: normalizeBase(process.env.PAGES_BASE_PATH),
  plugins: [react()],
  appType: "mpa",
  build: {
    rollupOptions: {
      input: ["index.html", "404.html"].map(name => fileURLToPath(new URL(name, import.meta.url))),
    },
  },
});
