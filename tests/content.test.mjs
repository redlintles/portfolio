import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { assetPath, isImageAssetName, isVideoAssetName } from "../lib/assets.mjs";
import {
  safeImage,
  safeProjectImage,
  safeVideo,
  validateProject,
  validateProjectAssets,
  validateProjectTranslations,
} from "../lib/validation.mjs";

/** Return independent metadata so validation cases cannot mutate another test's input. */
function projectFixture() {
  return JSON.parse(fs.readFileSync("projects/textforge.json", "utf8"));
}

/** A representative collection covers asset-folder, remote and Base64 image sources. */
function mediaFixture() {
  return {
    ...projectFixture(),
    image_links: [
      { link: "textforge/pipeline.png", description: "projects.textforge.media.pipeline" },
      { link: "data:image/png;base64,aGVsbG8=", description: "projects.textforge.media.pipeline" },
      { link: "https://example.com/image.png", description: "projects.textforge.media.pipeline" },
    ],
    video_links: [
      { link: "textforge/demo.mp4", description: "projects.textforge.media.demo" },
      { link: "https://example.com/demo.mp4", description: "projects.textforge.media.demo" },
    ],
  };
}

/** Load real dictionaries and add translated captions for the media fixture. */
function localeFixture() {
  return Object.fromEntries(
    ["pt-BR", "en", "es"].map((language) => {
      const copy = JSON.parse(fs.readFileSync(`locale/${language}.json`, "utf8"));
      copy.projects.textforge.media = {
        pipeline: "Text processing pipeline",
        demo: "Pipeline demonstration",
      };
      return [language, copy];
    }),
  );
}

test("images accept local, HTTPS and raster Base64 assets", () => {
  for (const value of [
    "/images/a.jpg",
    "https://example.com/a.jpg",
    "data:image/png;base64,aGVsbG8=",
  ]) {
    assert.equal(safeImage(value), true);
  }
  for (const value of [
    "javascript:alert(1)",
    "//example.com/a.jpg",
    "/\\example.com/a.jpg",
    "data:image/svg+xml;base64,AAAA",
    "http://example.com/a.jpg",
    "data:image/png;base64,!",
    "https://",
    "https://user:secret@example.com/image.png",
  ]) {
    assert.equal(safeImage(value), false);
  }
});

test("videos accept asset file names and HTTPS video files only", () => {
  for (const value of [
    "demo.mp4",
    "textforge/demo.webm",
    "https://example.com/media/demo.mp4",
    "https://example.com/demo.webm?download=1",
  ])
    assert.equal(safeVideo(value), true, value);
  for (const value of [
    "/media/demo.mp4",
    "https://example.com/watch?v=demo",
    "demo.mov",
    "data:video/mp4;base64,AAAA",
    "javascript:alert(1)",
    "//example.com/demo.mp4",
    1,
    null,
  ])
    assert.equal(safeVideo(value), false, String(value));
});

test("project supports empty collections and multiple described assets", () => {
  assert.doesNotThrow(() => validateProject(projectFixture()));
  assert.doesNotThrow(() => validateProject(mediaFixture()));
});

for (const field of ["image_links", "video_links"]) {
  for (const [label, value] of Object.entries({
    missing: undefined,
    scalar: "https://example.com/asset",
    legacyStrings: ["https://example.com/asset"],
    nullEntry: [null],
    arrayEntry: [[]],
    missingLink: [{ description: "projects.textforge.media.demo" }],
    missingDescription: [{ link: "https://example.com/asset" }],
    emptyDescription: [{ link: "https://example.com/asset", description: "" }],
    literalDescription: [{ link: "https://example.com/asset", description: "A short description" }],
    wrongNamespace: [
      { link: "https://example.com/asset", description: "projects.other.media.demo" },
    ],
    unsafeLink: [{ link: "javascript:alert(1)", description: "projects.textforge.media.demo" }],
  })) {
    test(`${field} rejects ${label}`, () => {
      assert.throws(
        () => validateProject({ ...projectFixture(), [field]: value }),
        new RegExp(field),
      );
    });
  }
}

test("legacy video_link is rejected with migration guidance", () => {
  assert.throws(
    () => validateProject({ ...projectFixture(), video_link: "" }),
    /Replace video_link with the video_links array/,
  );
});

test("project rejects invalid routes and unsafe outbound links", () => {
  for (const patch of [
    { slug: "../escape" },
    { type: "Other" },
    { project_link: "javascript:alert(1)" },
    { project_link: "https://" },
    { illustration_link: "javascript:alert(1)" },
    { description: "literal" },
  ]) {
    assert.throws(() => validateProject({ ...projectFixture(), ...patch }));
  }
});

test("all media captions must resolve to nonempty translations in every language", () => {
  const project = mediaFixture();
  assert.doesNotThrow(() => validateProjectTranslations(project, localeFixture()));
  for (const field of ["pipeline", "demo"]) {
    for (const value of [undefined, "", "   ", 10]) {
      const locales = localeFixture();
      locales.es.projects.textforge.media[field] = value;
      assert.throws(
        () => validateProjectTranslations(project, locales),
        new RegExp(`es.*media.${field}`),
      );
    }
  }
});

test("empty challenge text is valid while required project copy cannot be blank", () => {
  const locales = localeFixture();
  locales.en.projects.textforge.failures = "";
  assert.doesNotThrow(() => validateProjectTranslations(mediaFixture(), locales));
  locales.en.projects.textforge.description = "";
  assert.throws(() => validateProjectTranslations(mediaFixture(), locales), /en.*description/);
});

test("image asset names accept plain file names and subfolders only", () => {
  for (const value of ["home.png", "textforge/home.webp", "Captura de tela.JPG", "logo.svg"]) {
    assert.equal(isImageAssetName(value), true, value);
  }
  for (const value of [
    "",
    "/assets/home.png",
    "../secret.png",
    "textforge/../../home.png",
    "folder//home.png",
    "home",
    "home.txt",
    "C:\\home.png",
    "https://example.com/home.png",
    "data:image/png;base64,aGVsbG8=",
    "home.png?x=1",
    null,
  ]) {
    assert.equal(isImageAssetName(value), false, String(value));
  }
});

test("video asset names require a playable extension", () => {
  assert.equal(isVideoAssetName("Colour/demonstracao.mp4"), true);
  for (const value of ["demo.png", "../demo.mp4", "/assets/demo.mp4", "demo"]) {
    assert.equal(isVideoAssetName(value), false, value);
  }
});

test("asset paths join the assets folder and encode each segment", () => {
  assert.equal(assetPath("home.png"), "/assets/home.png");
  assert.equal(assetPath("textforge/tela inicial.png"), "/assets/textforge/tela%20inicial.png");
});

test("project images accept asset names, HTTPS and Base64 but not root paths", () => {
  for (const value of ["home.png", "https://example.com/a.png", "data:image/png;base64,aGVsbG8="]) {
    assert.equal(safeProjectImage(value), true, value);
  }
  for (const value of ["/images/a.png", "../a.png", "javascript:alert(1)"]) {
    assert.equal(safeProjectImage(value), false, value);
  }
});

test("asset validation requires every referenced image and video inside public/assets", () => {
  const publicDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-assets-"));
  try {
    fs.mkdirSync(path.join(publicDirectory, "assets/textforge"), { recursive: true });
    fs.writeFileSync(path.join(publicDirectory, "assets/textforge/pipeline.png"), "fixture");
    fs.writeFileSync(path.join(publicDirectory, "assets/textforge/demo.mp4"), "fixture");
    assert.doesNotThrow(() => validateProjectAssets(mediaFixture(), publicDirectory));
    const missingVideo = {
      ...mediaFixture(),
      video_links: [{ link: "absent.mp4", description: "projects.textforge.media.demo" }],
    };
    assert.throws(
      () => validateProjectAssets(missingVideo, publicDirectory),
      /video_links\[0\].*public\/assets\/absent\.mp4/,
    );
    const missing = {
      ...mediaFixture(),
      image_links: [{ link: "absent.png", description: "projects.textforge.media.pipeline" }],
    };
    assert.throws(
      () => validateProjectAssets(missing, publicDirectory),
      /image_links\[0\].*public\/assets\/absent\.png/,
    );
  } finally {
    fs.rmSync(publicDirectory, { recursive: true, force: true });
  }
});
