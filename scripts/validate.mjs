import fs from "node:fs";
import { validateProject, validateProjectTranslations } from "../lib/validation.mjs";

/** Walk locale objects without treating arrays as translated leaf strings. */
function shape(value, prefix = "") {
  if (value === null || typeof value !== "object") return [prefix];
  return Object.keys(value)
    .flatMap((key) => shape(value[key], `${prefix}.${key}`))
    .sort();
}

const locales = Object.fromEntries(
  ["pt-BR", "en", "es"].map((language) => [
    language,
    JSON.parse(fs.readFileSync(`locale/${language}.json`, "utf8")),
  ]),
);
const expected = JSON.stringify(shape(locales["pt-BR"]));
for (const locale of Object.values(locales)) {
  if (JSON.stringify(shape(locale)) !== expected) throw new Error("Locale structures must match");
}
const slugs = new Set();
for (const file of fs.readdirSync("projects").filter((file) => file.endsWith(".json"))) {
  const project = JSON.parse(fs.readFileSync(`projects/${file}`, "utf8"));
  validateProject(project);
  if (slugs.has(project.slug)) throw new Error(`Duplicate slug: ${project.slug}`);
  slugs.add(project.slug);
  validateProjectTranslations(project, locales);
}
console.log(`Validated ${slugs.size} projects and ${Object.keys(locales).length} languages.`);
