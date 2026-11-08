import { assetPath, isAssetName } from "./assets.mjs";

/** Prefix local media for repository-based Pages while preserving remote and data URLs. */
export function mediaUrl(value: string): string {
  return value.startsWith("/") ? `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${value}` : value;
}

/**
 * Resolve an `image_links[].link` value: a plain file name points to `public/assets/`;
 * HTTPS URLs and Base64 Data URLs are returned unchanged.
 */
export function projectImageUrl(link: string): string {
  return isAssetName(link) ? mediaUrl(assetPath(link)) : link;
}
