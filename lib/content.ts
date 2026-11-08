import fs from "node:fs";
import path from "node:path";
import pt from "@/locale/pt-BR.json";
import en from "@/locale/en.json";
import es from "@/locale/es.json";
import {
  validateProject,
  validateProjectAssets,
  validateProjectTranslations,
} from "./validation.mjs";

/** Supported languages are exported statically, without a translation service. */
export const languages = ["pt-BR", "en", "es"] as const;
export type Language = (typeof languages)[number];
/** Language served by addresses without a language prefix, such as `/` or `/projects/`. */
export const defaultLanguage: Language = "pt-BR";
export type Dictionary = typeof pt;
/** Asset location and localized caption shared by images and videos. */
export type ProjectMedia = {
  /** Images: file name in `public/assets/`, HTTPS URL or Data URL. Videos: path or HTTPS URL. */
  link: string;
  description: string;
};

/** Project metadata loaded from the projects directory. */
export type Project = {
  slug: string;
  type: "Primary" | "Secondary";
  project_name: string;
  description: string;
  technologies: string[];
  image_links: ProjectMedia[];
  /** Fallback artwork for projects without screenshots. */
  illustration_link?: string;
  video_links: ProjectMedia[];
  github_repo: string;
  successes: string;
  project_link?: string;
  failures: string;
};

/** Reject unknown language segments instead of falling back silently. */
export function isLanguage(value: string): value is Language {
  return languages.some((language) => language === value);
}

/** Return a complete local dictionary with matching structure in each language. */
export function dictionary(language: Language): Dictionary {
  return { "pt-BR": pt, en, es }[language];
}

/** Page title template and description for every page of one language. */
export function siteMetadata(language: Language) {
  const copy = dictionary(language);
  return {
    title: { default: `${copy.name} · ${copy.portfolio}`, template: `%s · ${copy.name}` },
    description: copy.heroBody,
  };
}

/** Resolve a locale key; plain content is intentionally disallowed by validation. */
export function translate(copy: Dictionary, key: string): string {
  let current: unknown = copy;
  for (const part of key.split(".")) {
    if (!current || typeof current !== "object") throw new Error(`Invalid locale key: ${key}`);
    current = (current as Record<string, unknown>)[part];
  }
  if (typeof current !== "string") throw new Error(`Missing translation: ${key}`);
  return current;
}

/** Read and validate each project at build time; filenames define no public routes. */
export function projects(): Project[] {
  const directory = path.join(process.cwd(), "projects");
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      const project: unknown = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
      validateProject(project);
      validateProjectTranslations(project, { "pt-BR": pt, en, es });
      validateProjectAssets(project, path.join(process.cwd(), "public"));
      return project as Project;
    });
}
