import manifest from '~~/data/media-manifest.json'
import type { MediaManifest } from '~~/shared/media'

const EMPTY: MediaManifest = { jobs: {}, projects: {} }

/**
 * Generated media manifest (page counts and ratios). A function so tests can mock it.
 * Empty when the build has no media (public/media absent, or NUXT_PUBLIC_NO_MEDIA=1), so every image
 * renders its placeholder instead of pointing at a missing file.
 */
export function useManifest(): MediaManifest {
  return useRuntimeConfig().public.noMedia ? EMPTY : (manifest as unknown as MediaManifest)
}
