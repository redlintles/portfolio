import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

/** Collect generated HTML recursively for checks independent of a running server. */
function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : file.endsWith(".html") ? [file] : [];
  });
}

/** Verify every internal href/src points to an exported route or a real static asset. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const files = htmlFiles("out");
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const language = path.relative("out", file).split(path.sep)[0];
  if (["pt-BR", "en", "es"].includes(language)) {
    assert.ok(html.includes(`<html lang="${language}"`), `Wrong document language: ${file}`);
  }
  for (const match of html.matchAll(/(?:href|src)="([^"\s]+)"/g)) {
    let url = match[1].split(/[?#]/)[0];
    if (!url.startsWith("/") || url.startsWith("//")) continue;
    if (basePath) {
      assert.ok(url.startsWith(`${basePath}/`), `Missing basePath: ${url} in ${file}`);
      url = url.slice(basePath.length);
    }
    let target = path.join("out", decodeURIComponent(url));
    if (url.endsWith("/")) target = path.join(target, "index.html");
    assert.ok(fs.existsSync(target), `Missing export: ${url} in ${file}`);
  }
}
console.log(`Verified internal links, media and document languages in ${files.length} HTML files.`);
