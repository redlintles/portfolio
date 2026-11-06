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

/** Permit browser-safe public links, local images, and raster image Data URLs only. */
export function safeImage(value) {
  return (
    typeof value === "string" &&
    (/^\/(?!\/)/.test(value) ||
      safeHttps(value) ||
      /^data:image\/(png|jpeg|webp|gif|avif);base64,[A-Za-z0-9+/=\r\n]+$/.test(value))
  );
}

/** Fail before export when a project is incomplete or contains unsafe link schemes. */
export function validateProject(project) {
  if (!project || typeof project !== "object") throw new Error("Project must be an object");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug || "")) throw new Error("Invalid slug");
  if (!["Primary", "Secondary"].includes(project.type)) throw new Error("Invalid project type");
  for (const key of ["project_name", "description", "successes", "failures"]) {
    if (typeof project[key] !== "string" || !project[key].startsWith(`projects.${project.slug}.`))
      throw new Error(`Expected locale key: ${key}`);
  }
  if (
    !Array.isArray(project.technologies) ||
    !project.technologies.every((item) => typeof item === "string")
  )
    throw new Error("Invalid technologies");
  if (!Array.isArray(project.image_links) || !project.image_links.every(safeImage))
    throw new Error("Invalid image URL");
  if (project.illustration_link !== undefined && !safeImage(project.illustration_link))
    throw new Error("Invalid illustration URL");
  for (const key of ["github_repo", "video_link", "project_link"]) {
    const value = project[key];
    if (value !== undefined && value !== "" && !safeHttps(value))
      throw new Error(`Expected HTTPS URL: ${key}`);
  }
  if (!project.github_repo) throw new Error("Missing GitHub repository");
}
