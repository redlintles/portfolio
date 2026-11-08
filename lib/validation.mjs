import fs from "node:fs";
import path from "node:path";
import { ASSET_FOLDER, isAssetName } from "./assets.mjs";

/** Accept complete HTTPS URLs without embedded credentials. */
function safeHttps(value) {
  if (typeof value !== "string" || !value.startsWith("https://")) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

/** Local assets use root-relative paths without protocol-relative or backslash syntax. */
function safeLocalAsset(value) {
  return typeof value === "string" && /^\/(?!\/)/.test(value) && !value.includes("\\");
}

/** Raster images embedded as Base64; SVG Data URLs are excluded because they can carry scripts. */
function safeDataImage(value) {
  return (
    typeof value === "string" &&
    /^data:image\/(png|jpeg|webp|gif|avif);base64,[A-Za-z0-9+/=\r\n]+$/.test(value)
  );
}

/** Permit root-relative local images, HTTPS images, and raster image Data URLs. */
export function safeImage(value) {
  return safeLocalAsset(value) || safeHttps(value) || safeDataImage(value);
}

/** Project screenshots: a file name inside `public/assets/`, an HTTPS URL or a Data URL. */
export function safeProjectImage(value) {
  return isAssetName(value) || safeHttps(value) || safeDataImage(value);
}

/** Videos link to a local file or an HTTPS resource; embedded Data URLs are not supported. */
export function safeVideo(value) {
  return safeLocalAsset(value) || safeHttps(value);
}

/** Require an asset location and a project-scoped locale key for every media entry. */
function validateMedia(items, field, slug, validLink) {
  if (!Array.isArray(items)) throw new Error(`${field} must be an array`);
  for (const [index, item] of items.entries()) {
    const location = `${field}[${index}]`;
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`${location} must contain link and description`);
    }
    if (!validLink(item.link)) throw new Error(`Invalid media link: ${location}.link`);
    validateLocaleKey(item.description, slug, `${location}.description`);
  }
}

/** Keep project content keys inside the matching translation namespace. */
function validateLocaleKey(value, slug, field) {
  const prefix = `projects.${slug}.`;
  if (
    typeof value !== "string" ||
    !value.startsWith(prefix) ||
    !value.slice(prefix.length).trim()
  ) {
    throw new Error(`Expected locale key: ${field}`);
  }
}

/** Fail before export when project metadata or media collections are malformed. */
export function validateProject(project) {
  if (!project || typeof project !== "object" || Array.isArray(project)) {
    throw new Error("Project must be an object");
  }
  if (typeof project.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) {
    throw new Error("Invalid slug");
  }
  if (!["Primary", "Secondary"].includes(project.type)) throw new Error("Invalid project type");
  for (const key of ["project_name", "description", "successes", "failures"]) {
    validateLocaleKey(project[key], project.slug, key);
  }
  if (
    !Array.isArray(project.technologies) ||
    !project.technologies.every((item) => typeof item === "string")
  )
    throw new Error("Invalid technologies");
  if ("video_link" in project) throw new Error("Replace video_link with the video_links array");
  validateMedia(project.image_links, "image_links", project.slug, safeProjectImage);
  validateMedia(project.video_links, "video_links", project.slug, safeVideo);
  if (project.illustration_link !== undefined && !safeImage(project.illustration_link)) {
    throw new Error("Invalid illustration URL");
  }
  for (const key of ["github_repo", "project_link"]) {
    const value = project[key];
    if (value !== undefined && value !== "" && !safeHttps(value)) {
      throw new Error(`Expected HTTPS URL: ${key}`);
    }
  }
  if (!project.github_repo) throw new Error("Missing GitHub repository");
}

/** Validate translated text, including every media caption, in each supported language. */
export function validateProjectTranslations(project, locales) {
  const fields = [
    ...["project_name", "description", "successes", "failures"].map((field) => ({
      key: project[field],
      allowEmpty: field === "failures",
    })),
    ...project.image_links.map((asset) => ({ key: asset.description, allowEmpty: false })),
    ...project.video_links.map((asset) => ({ key: asset.description, allowEmpty: false })),
  ];
  for (const [language, copy] of Object.entries(locales)) {
    for (const { key, allowEmpty } of fields) {
      let value = copy;
      for (const part of key.split(".")) {
        value =
          value && typeof value === "object" && Object.hasOwn(value, part)
            ? value[part]
            : undefined;
      }
      if (typeof value !== "string" || (!allowEmpty && !value.trim())) {
        throw new Error(`Missing translation (${language}): ${key}`);
      }
    }
  }
}

/** Fail when an image file name has no matching file in `public/assets/`. */
export function validateProjectAssets(project, publicDirectory) {
  for (const [index, image] of project.image_links.entries()) {
    if (!isAssetName(image.link)) continue;
    const file = path.join(publicDirectory, ASSET_FOLDER, image.link);
    if (!fs.statSync(file, { throwIfNoEntry: false })?.isFile()) {
      throw new Error(
        `Missing asset file: image_links[${index}].link -> public/${ASSET_FOLDER}/${image.link}`,
      );
    }
  }
}
