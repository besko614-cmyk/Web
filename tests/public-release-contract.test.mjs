import assert from "node:assert/strict";
import test from "node:test";
import {
  PUBLIC_RELEASE_SLUG,
  PublicReleaseNotFoundError,
  getScopedPublicReleaseDelivery,
} from "../server/public-release-contract.mjs";

const eligibleRelease = {
  slug: PUBLIC_RELEASE_SLUG,
  title: "Bloom after dark",
  description: "A short garden study released free for everyone.",
  coverUrl: "https://example.test/bloom-cover.jpg",
  accessModel: "public",
  priceCents: 0,
  sourceType: "upload",
  videoFileKey: "protected/releases/bloom-after-dark.mp4",
};

test("an anonymous request receives sanitized metadata and a signed delivery URL for the one fixed release", async () => {
  const result = await getScopedPublicReleaseDelivery({
    findReleaseBySlug: async (slug) => {
      assert.equal(slug, PUBLIC_RELEASE_SLUG);
      return eligibleRelease;
    },
    storageGet: async (key) => {
      assert.equal(key, eligibleRelease.videoFileKey);
      return { url: "https://signed.example.test/bloom-after-dark.mp4?expires=temporary" };
    },
  });

  assert.deepEqual(result, {
    slug: "bloom-after-dark",
    title: "Bloom after dark",
    description: "A short garden study released free for everyone.",
    coverUrl: "https://example.test/bloom-cover.jpg",
    mediaType: "video",
    downloadFileName: "bloom-after-dark.mp4",
    deliveryUrl: "https://signed.example.test/bloom-after-dark.mp4?expires=temporary",
  });
  assert.equal("videoFileKey" in result, false);
});

test("the anonymous delivery route rejects the same release when it is no longer public", async () => {
  let storageWasCalled = false;

  await assert.rejects(
    getScopedPublicReleaseDelivery({
      findReleaseBySlug: async () => ({ ...eligibleRelease, accessModel: "purchase" }),
      storageGet: async () => {
        storageWasCalled = true;
        return { url: "https://should-not-be-called.example.test" };
      },
    }),
    (error) => error instanceof PublicReleaseNotFoundError && error.code === "NOT_FOUND",
  );

  assert.equal(storageWasCalled, false);
});

test("a catalog item with another slug cannot be delivered through this scoped route", async () => {
  await assert.rejects(
    getScopedPublicReleaseDelivery({
      findReleaseBySlug: async () => ({ ...eligibleRelease, slug: "members-cut" }),
      storageGet: async () => ({ url: "https://should-not-be-called.example.test" }),
    }),
    PublicReleaseNotFoundError,
  );
});
