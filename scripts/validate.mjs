import fs from "node:fs";
import { validateProject } from "../lib/validation.mjs";

/** Walk locale objects without treating arrays as translated leaf strings. */
function shape(value, prefix = "") {
  if (value === null || typeof value !== "object") return [prefix];
  return Object.keys(value)
    .flatMap((key) => shape(value[key], `${prefix}.${key}`))
    .sort();
}

/** Resolve a dot-separated translation key or fail with actionable context. */
function resolve(copy, key, allowEmpty = false) {
  let value = copy;
  for (const part of key.split(".")) value = value?.[part];
  if (typeof value !== "string" || (!allowEmpty && !value.trim()))
    throw new Error(`Missing translation: ${key}`);
}

const locales = ["pt-BR", "en", "es"].map((language) =>
  JSON.parse(fs.readFileSync(`locale/${language}.json`, "utf8")),
);
const expected = JSON.stringify(shape(locales[0]));
for (const locale of locales) {
  if (JSON.stringify(shape(locale)) !== expected) throw new Error("Locale structures must match");
}
const slugs = new Set();
for (const file of fs.readdirSync("projects").filter((file) => file.endsWith(".json"))) {
  const project = JSON.parse(fs.readFileSync(`projects/${file}`, "utf8"));
  validateProject(project);
  if (slugs.has(project.slug)) throw new Error(`Duplicate slug: ${project.slug}`);
  slugs.add(project.slug);
  for (const locale of locales) {
    for (const key of ["project_name", "description", "successes", "failures"])
      resolve(locale, project[key], key === "failures");
  }
}
console.log(`Validated ${slugs.size} projects and ${locales.length} languages.`);
