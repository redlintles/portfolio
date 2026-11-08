import { assetPath } from "./assets.mjs";

/** Prefix local media for repository-based Pages while preserving remote and data URLs. */
export function mediaUrl(value: string): string {
  return value.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${value}` : value;
}

/**
 * Resolve an `image_links[].link` or `video_links[].link` value. Validation guarantees the
 * value is an HTTPS URL, an image Data URL, or a file name inside `public/assets/`; only
 * the file name needs the assets folder and the GitHub Pages prefix.
 */
export function projectMediaUrl(link: string): string {
  if (link.startsWith("https://") || link.startsWith("data:")) return link;
  return mediaUrl(assetPath(link));
}
