export const PUBLIC_RELEASE_SLUG = "bloom-after-dark";

export class PublicReleaseNotFoundError extends Error {
  constructor() {
    super("The requested public release is unavailable.");
    this.name = "PublicReleaseNotFoundError";
    this.code = "NOT_FOUND";
  }
}

/**
 * Demonstration of the server boundary for a single free public release.
 * The function intentionally accepts no slug or release ID from the browser.
 * Replace `findReleaseBySlug` and `storageGet` with the storefront's approved
 * database and protected-storage helpers in a real full-stack project.
 */
export async function getScopedPublicReleaseDelivery({ findReleaseBySlug, storageGet }) {
  const release = await findReleaseBySlug(PUBLIC_RELEASE_SLUG);

  if (
    !release ||
    release.slug !== PUBLIC_RELEASE_SLUG ||
    release.accessModel !== "public" ||
    release.priceCents !== 0 ||
    release.sourceType !== "upload" ||
    !release.videoFileKey
  ) {
    throw new PublicReleaseNotFoundError();
  }

  const delivery = await storageGet(release.videoFileKey);

  return {
    slug: release.slug,
    title: release.title,
    description: release.description,
    coverUrl: release.coverUrl,
    mediaType: "video",
    downloadFileName: "bloom-after-dark.mp4",
    deliveryUrl: delivery.url,
  };
}

/**
 * Example tRPC shape in an actual application:
 *
 * publicRelease: publicProcedure.query(() =>
 *   getScopedPublicReleaseDelivery({ findReleaseBySlug, storageGet })
 * )
 *
 * The endpoint has no input, so a visitor cannot substitute another release.
 */
