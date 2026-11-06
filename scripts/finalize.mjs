import fs from "node:fs";
import path from "node:path";

/** Static HTML receives the correct document language before GitHub Pages publication. */
function finalize(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) finalize(file);
    else if (file.endsWith(".html")) {
      const language = path.relative("out", file).split(path.sep)[0];
      if (["pt-BR", "en", "es"].includes(language)) {
        const html = fs.readFileSync(file, "utf8");
        fs.writeFileSync(file, html.replace('<html lang="pt-BR"', `<html lang="${language}"`));
      }
    }
  }
}
finalize("out");
fs.writeFileSync("out/.nojekyll", "");
