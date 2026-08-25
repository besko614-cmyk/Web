import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("the homepage keeps the public release controls in a safe loading state until delivery resolves", () => {
  assert.match(page, /id="download-release"[\s\S]*?aria-disabled="true"[\s\S]*?download="bloom-after-dark\.mp4"/);
  assert.match(page, /id="watch-release"[\s\S]*?aria-disabled="true"[\s\S]*?target="_blank"/);
  assert.match(page, /A real route must not receive an arbitrary slug, record ID, storage key, or direct media URL from the visitor/);
});

test("the homepage supplies a keyboard-accessible preview, release detail, and sharing affordance", () => {
  assert.match(page, /<dialog id="preview-dialog" aria-labelledby="preview-dialog-title">/);
  assert.match(page, /id="preview-release" class="button button-primary" type="button"/);
  assert.match(page, /id="stage-play" class="round-button" type="button" aria-label="Preview Bloom after dark"/);
  assert.match(page, /id="share-release" class="button button-tertiary" type="button" aria-live="polite"/);
});

test("the members-only archive remains visually and textually separate from the free public edition", () => {
  assert.match(page, /id="access" class="access-block"/);
  assert.match(page, /id="collection" class="collection shell"/);
  assert.match(page, /Members’ library/);
  assert.match(page, /The anonymous route has no visitor-controlled slug or ID\./);
});
