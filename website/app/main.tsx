import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource/barlow/latin-400.css";
import "@fontsource/barlow/latin-500.css";
import "@fontsource/barlow/latin-600.css";
import "@fontsource/barlow/latin-700.css";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/orbitron";
import "./globals.css";
import Home from "./page";

const root = document.getElementById("root")!;
if (root.firstElementChild) {
  hydrateRoot(root, <Home />);
} else {
  createRoot(root).render(<Home />);
}
