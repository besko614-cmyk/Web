# Free Public Video Release — Demonstration

This repository demonstrates the **presentation and access boundary** for one named video that can be watched and downloaded without sign-in. It is deliberately a small static prototype because the supplied repository did not contain a storefront application, catalog schema, authentication layer, or protected object storage integration.

| Component | Demonstrated behavior | Production implementation |
| --- | --- | --- |
| Public release | **Bloom after dark** has clear watch and MP4 download actions. | Store one uploaded MP4 in protected object storage and set `accessModel: "public"` and `priceCents: 0`. |
| Anonymous access | Actions wait briefly, representing retrieval of a temporary delivery URL. | Use a no-input public procedure that looks up a **fixed slug** and returns a signed URL. |
| Catalog boundary | The page explicitly says the rest of the catalog is protected. | Keep catalog browsing, arbitrary detail lookups, library, and generic downloads behind existing authorization. |
| Data exposure | The browser only needs title, description, cover, file name, and a temporary delivery URL. | Keep the storage key on the server and omit it from serialized metadata. |

The front-end uses [MDN’s CC0 flower sample](https://interactive-examples.mdn.mozilla.net/pages/tabbed/source.html) strictly as visual prototype media. It does **not** model the production storage layer. Do not put real large video files in `client/public` or expose permanent media URLs.

## Included examples

The live card is an artist-premiere pattern for **Bloom after dark**. The interface also shows two distinct, practical release concepts: a **festival director Q&A** for a time-limited takeaway and a **community edition** that offers one chapter from an otherwise protected paid series. These examples all retain the same one-release access rule.

## Security contract

`server/public-release-contract.mjs` is framework-agnostic sample server code. It contains a fixed `PUBLIC_RELEASE_SLUG`, accepts no visitor-controlled slug or ID, validates the release’s `public` access model and `upload` source, and obtains the URL from protected storage only after validation.

`tests/public-release-contract.test.mjs` proves both the permitted anonymous response and the rejection path once the release is no longer public. Run the focused checks with:

```bash
node --test tests/public-release-contract.test.mjs
```

For a full storefront, wire this contract to the project’s existing database, protected storage helper, and router layer. Add a route test using an actual anonymous context; update the authenticated catalog so this one fixed release opens the signed URL rather than checkout; then run the application’s complete test suite and inspect the rendered homepage.

## Local preview

The demo is plain HTML. Open `index.html` directly in a browser or serve the repository with any static server. The video sample must remain replaceable with a user-supplied MP4 when converting the prototype to a real release.
