export function normalizeBase(value = "") {
  const pathname = value.replace(/\/+$/, "");
  if (pathname === "") return "/";
  if (!/^\/(?:[\w.-]+\/)*[\w.-]+$/.test(pathname) ||
      pathname.split("/").some(segment => segment === "." || segment === "..")) {
    throw new Error(`PAGES_BASE_PATH must be a URL path such as /r3akt: ${value}`);
  }
  return `${pathname}/`;
}
