import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// A repository path is required only for project-based GitHub Pages deployments.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Builds use static export for GitHub Pages. The dev server runs without it: in export
 * mode, `next dev` answers unknown addresses (e.g. `/home/`, `/favicon.ico`) with a 500
 * instead of the 404 page. `npm run build` still validates every export restriction.
 */
export default function config(phase: string): NextConfig {
  return {
    output: phase === PHASE_DEVELOPMENT_SERVER ? undefined : "export",
    trailingSlash: true,
    basePath,
    images: { unoptimized: true },
  };
}
