# John Louis Cabulao — construction estimator portfolio

Static Nuxt 4 site (Nuxt Content for the YAML in `content/`), prerendered with `nuxt generate` and deployed as plain files.

## Setup

```sh
npm install            # also runs `nuxt prepare`
npm run generate       # build the static site into .output/public
npm run preview        # serve .output/public on http://localhost:4173 (unknown paths get the 404 page)
```

Node 22 or later. `npm run dev` starts the Nuxt dev server on :3000.

## Images: `npm run assets`

Sheets and project screenshots are rendered from the private source folder, which is not part of this repository:

```sh
npm run assets                          # every published job and project
npm run assets -- --only plastering-01  # one job or project slug
npm run assets -- --force               # re-render even when the output exists
```

It needs:

- the source folder at `PORTFOLIO_SOURCE` (default: the parent folder `..`);
- a git-ignored `sources.local.yml` that maps each multi-trade slug to its source folder and lists `forbiddenTerms`
  (names that must never appear in the site). Copy `sources.local.example.yml` to start.

It writes the images to `public/media/` and the page counts and ratios to `data/media-manifest.json` (committed).

### The media / OK rule

`public/media/` is committed. John confirmed that page 1 of each job's markup and the project images may be
published; only content with `public: true` ever gets images. Later pages of a job stay unpublished until John
clears them, so `npm run assets` must not be run for those pages until then. When `public/media/` is absent at
build time (a checkout without it), the manifest is treated as empty and every image renders a designed
placeholder ("Drawing available on request"); see `nuxt.config.ts` and `app/composables/useManifest.ts`.
`NUXT_PUBLIC_NO_MEDIA=1` forces the same behaviour locally.

## Environment variables

| Variable | Used for | Default |
| --- | --- | --- |
| `NUXT_PUBLIC_SITE_URL` | Canonical and Open Graph URLs, `sitemap.xml`, `robots.txt`, JSON-LD | `https://$VERCEL_PROJECT_PRODUCTION_URL` on Vercel, else `https://example.com` (a production build on Vercel warns if it has to use that) |
| `NUXT_PUBLIC_FORMSPREE_ID` | Contact form endpoint (`https://formspree.io/f/<id>`); without it the contact page shows no form, only the email address and copy button | empty |
| `NUXT_PUBLIC_NO_MEDIA` | `1` builds as if `public/media/` were absent (into `.output-no-media/`) | unset |
| `PORTFOLIO_SOURCE` | Source folder for `npm run assets` | `..` |
| `CHROME_PATH` | Chrome for the Lighthouse gate; falls back to Playwright's Chromium | system Chrome |

Set the two `NUXT_PUBLIC_*` values at build time; the site is static, so changing them needs a rebuild.

## Vercel

- Framework preset: **Nuxt**
- Build command: `npm run build` (runs `nuxt generate`)
- Output directory: leave it at the default. On Vercel, Nitro detects the platform and uses its `vercel-static`
  preset, which writes the prerendered site to `.vercel/output/static` (Build Output API). Do not set the output
  directory to `.output/public`; that would bypass it.
- Environment variables: `NUXT_PUBLIC_SITE_URL` (the production URL, no trailing slash; optional on Vercel, which
  supplies `VERCEL_PROJECT_PRODUCTION_URL` as the fallback) and `NUXT_PUBLIC_FORMSPREE_ID`

## Tests and quality gates

```sh
npm test        # Vitest: tests/unit (node) and tests/nuxt (Nuxt environment)
npm run e2e     # Playwright (desktop, mobile, narrow); builds both outputs first unless SKIP_GENERATE=1
npm run check   # everything below, in order; this is the gate before a commit or deploy
```

`npm run check` runs:

1. `npm run generate`, the normal build into `.output/public`;
2. `npm run generate:no-media`, a build with `NUXT_PUBLIC_NO_MEDIA=1` into `.output-no-media/public`, served on :4174 for
   `tests/e2e/no-media.spec.ts` (pages must render placeholders, with no broken images);
3. `vitest run`, including `tests/unit/output-scan.test.ts`, which scans the fresh `.output/public`:
   no source folder paths, no client names (whole words, read at runtime from `sources.local.yml`), hero image
   at most 250 KB, a sitemap with every job, robots.txt, per-page title, description, canonical and og:image,
   and the JSON-LD. On a plain `npm test` without a build these checks are skipped, and say so; without
   `sources.local.yml` the client-name scan is skipped, and says so;
4. `SKIP_GENERATE=1 playwright test`, against both builds;
5. `node scripts/check-lighthouse.mjs`: Lighthouse mobile on `/`, `/multi-trade/aged-care-residence/` and
   `/single-trade/plastering/1/` (three runs each, judged on the median run). Fails if any category is below 90 or
   LCP is above 2500 ms. Reports go to `.lighthouse/`.

The preview server compresses text responses (brotli or gzip) like the production host, so Lighthouse sees
realistic transfer sizes.
