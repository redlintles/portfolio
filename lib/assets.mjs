/**
 * Project screenshots and videos live in `public/assets/`. JSON files reference them by
 * file name only, and this module turns that name into the public URL path served by
 * Next.js. The module has no Node.js imports, so client components can use it safely.
 */

/** Folder inside `public/` that holds project media referenced by file name. */
export const ASSET_FOLDER = "assets";

/** Image formats accepted from the assets folder. */
export const IMAGE_EXTENSION = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

/** Video formats that browsers play natively in a `<video>` element. */
export const VIDEO_EXTENSION = /\.(mp4|webm|ogv|ogg)$/i;

/**
 * Accept a relative file name, optionally inside subfolders (e.g. `textforge/home.png`).
 * Absolute paths, URLs, backslashes, `..` segments and control characters are rejected,
 * so a name can never point outside the assets folder.
 */
function isSafeRelativeName(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  if (value.startsWith("/") || value.includes("\\")) return false;
  if (/[?#:]/.test(value) || /[\u0000-\u001f]/.test(value)) return false;
  const segments = value.split("/");
  return segments.every((segment) => segment.trim() && segment !== "." && segment !== "..");
}

/** Image file name inside the assets folder. */
export function isImageAssetName(value) {
  return isSafeRelativeName(value) && IMAGE_EXTENSION.test(value);
}

/** Video file name inside the assets folder. */
export function isVideoAssetName(value) {
  return isSafeRelativeName(value) && VIDEO_EXTENSION.test(value);
}

/** Join the assets folder with the file name, encoding spaces and accents for the URL. */
export function assetPath(name) {
  const encoded = name.split("/").map(encodeURIComponent).join("/");
  return `/${ASSET_FOLDER}/${encoded}`;
}
