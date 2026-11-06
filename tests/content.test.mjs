import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { safeImage, validateProject } from "../lib/validation.mjs";

/** Verify external input rejects unsafe schemes while preserving supported media formats. */
test("image validation supports raster Base64 and local/HTTPS URLs", () => {
  for (const value of [
    "/images/a.jpg",
    "https://example.com/a.jpg",
    "data:image/png;base64,aGVsbG8=",
  ])
    assert.equal(safeImage(value), true);
  for (const value of [
    "javascript:alert(1)",
    "//example.com/a.jpg",
    "data:image/svg+xml;base64,AAAA",
    "http://example.com/a.jpg",
    "data:image/png;base64,!",
    "https://",
    "https://user:secret@example.com/image.png",
  ])
    assert.equal(safeImage(value), false);
});

/** Validate malformed project types and outbound links independently of rendering. */
test("project schema rejects invalid routes and unsafe links", () => {
  const project = JSON.parse(fs.readFileSync("projects/textforge.json", "utf8"));
  assert.doesNotThrow(() => validateProject(project));
  for (const patch of [
    { slug: "../escape" },
    { type: "Other" },
    { project_link: "javascript:alert(1)" },
    { video_link: 0 },
    { project_link: "https://" },
    { image_links: ["invalid"] },
    { illustration_link: "javascript:alert(1)" },
    { description: "hardcoded" },
  ])
    assert.throws(() => validateProject({ ...project, ...patch }));
});
