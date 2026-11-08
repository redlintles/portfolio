/** Type declarations for the dependency-free assets module. */
export const ASSET_FOLDER: string;
export const IMAGE_EXTENSION: RegExp;
export const VIDEO_EXTENSION: RegExp;
export function isImageAssetName(value: unknown): boolean;
export function isVideoAssetName(value: unknown): boolean;
export function assetPath(name: string): string;
