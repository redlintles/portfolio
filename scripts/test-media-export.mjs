import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

/** Run a build/check in the isolated fixture, surfacing build logs on failure. */
function run(command, args, directory) {
  const result = spawnSync(command, args, {
    cwd: directory,
    env: { ...process.env, NEXT_PUBLIC_BASE_PATH: "/media-test", NEXT_TELEMETRY_DISABLED: "1" },
    encoding: "utf8",
    timeout: 180000,
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
}

/** Build real routes with multiple image/video assets without changing portfolio content. */
const root = process.cwd();
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-media-"));
try {
  for (const entry of [
    "app",
    "components",
    "lib",
    "locale",
    "projects",
    "public",
    "scripts",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "next-env.d.ts",
    "next.config.ts",
    "postcss.config.mjs",
    "tailwind.config.ts",
  ]) {
    fs.cpSync(path.join(root, entry), path.join(fixture, entry), { recursive: true });
  }
  fs.symlinkSync(path.join(root, "node_modules"), path.join(fixture, "node_modules"), "dir");
  const projectFile = path.join(fixture, "projects/textforge.json");
  const project = JSON.parse(fs.readFileSync(projectFile, "utf8"));
  project.image_links = [
    { link: "teste/pipeline final.svg", description: "projects.textforge.media.pipeline" },
    {
      link: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
      description: "projects.textforge.media.sample",
    },
  ];
  project.video_links = [
    { link: "/demo.mp4", description: "projects.textforge.media.demo" },
    { link: "https://example.com/demo.mp4", description: "projects.textforge.media.external" },
  ];
  fs.writeFileSync(projectFile, JSON.stringify(project));
  // Images are referenced by file name and resolved inside public/assets/.
  fs.mkdirSync(path.join(fixture, "public/assets/teste"), { recursive: true });
  fs.copyFileSync(
    path.join(root, "public/images/projects/textforge.svg"),
    path.join(fixture, "public/assets/teste/pipeline final.svg"),
  );
  // The video is a link target only; no player or playback request is involved in this test.
  fs.writeFileSync(path.join(fixture, "public/demo.mp4"), "fixture");
  const captions = {
    "pt-BR": {
      pipeline: "Pipeline de texto",
      sample: "Resultado do processamento",
      demo: "Demonstracao local",
      external: "Demonstracao externa",
    },
    en: {
      pipeline: "Text pipeline",
      sample: "Processing result",
      demo: "Local demonstration",
      external: "External demonstration",
    },
    es: {
      pipeline: "Pipeline de texto",
      sample: "Resultado del procesamiento",
      demo: "Demostracion local",
      external: "Demostracion externa",
    },
  };
  for (const [language, media] of Object.entries(captions)) {
    const file = path.join(fixture, `locale/${language}.json`);
    const copy = JSON.parse(fs.readFileSync(file, "utf8"));
    copy.projects.textforge.media = media;
    fs.writeFileSync(file, JSON.stringify(copy));
  }
  run("npm", ["run", "build"], fixture);
  run(process.execPath, ["scripts/verify-export.mjs"], fixture);
  for (const [language, media] of Object.entries(captions)) {
    const html = fs.readFileSync(
      path.join(fixture, `out/${language}/projects/textforge/index.html`),
      "utf8",
    );
    for (const caption of [media.pipeline, media.sample]) {
      assert.ok(html.includes(`alt="${caption}"`), `Missing image alternative: ${language}`);
      assert.ok(
        html.includes(`<figcaption>${caption}</figcaption>`),
        `Missing image caption: ${language}`,
      );
    }
    assert.ok(html.includes('href="/media-test/demo.mp4"'), "Local video needs basePath");
    assert.ok(
      html.includes('href="https://example.com/demo.mp4"'),
      "External video URL must remain unchanged",
    );
    assert.ok(
      html.includes(media.demo) && html.includes(media.external),
      "Both video descriptions must appear",
    );
    assert.ok(
      !html.includes('class="detail__illustration"'),
      "Screenshots must replace fallback artwork",
    );
    const home = fs.readFileSync(path.join(fixture, `out/${language}/index.html`), "utf8");
    assert.ok(
      home.includes('src="/media-test/assets/teste/pipeline%20final.svg"'),
      "Cards must resolve the first image inside the assets folder",
    );
  }
  console.log(
    "Media export passed: asset-folder images, multiple videos, translated captions, Base64, fallback priority and basePath.",
  );
} finally {
  fs.rmSync(fixture, { recursive: true, force: true });
}
