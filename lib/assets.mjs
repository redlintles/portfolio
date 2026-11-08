/**
 * Project screenshots live in `public/assets/`. JSON files reference them by file name
 * only, and this module turns that name into the public URL path served by Next.js.
 * The module has no Node.js imports, so client components can use it safely.
 */

/** Folder inside `public/` that holds project images referenced by file name. */
export const ASSET_FOLDER = "assets";

/** Image formats accepted from the assets folder. */
const IMAGE_EXTENSION = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

/**
 * Accept a file name, optionally inside subfolders (e.g. `textforge/home.png`).
 * Absolute paths, URLs, backslashes, `..` segments and control characters are rejected,
 * so a name can never point outside the assets folder.
 */
export function isAssetName(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  if (value.startsWith("/") || value.includes("\\")) return false;
  if (/[?#:]/.test(value) || /[\u0000-\u001f]/.test(value)) return false;
  const segments = value.split("/");
  if (segments.some((segment) => !segment.trim() || segment === "." || segment === "..")) {
    return false;
  }
  return IMAGE_EXTENSION.test(value);
}

/** Join the assets folder with the file name, encoding spaces and accents for the URL. */
export function assetPath(name) {
  const encoded = name.split("/").map(encodeURIComponent).join("/");
  return `/${ASSET_FOLDER}/${encoded}`;
}
