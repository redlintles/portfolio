import type { NextConfig } from "next";

// A repository path is required only for project-based GitHub Pages deployments.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};
export default config;
