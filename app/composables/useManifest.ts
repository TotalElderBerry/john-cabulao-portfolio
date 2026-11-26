import manifest from '~~/data/media-manifest.json'
import type { MediaManifest } from '~~/shared/media'

/** Generated media manifest (page counts and ratios). A function so tests can mock it. */
export function useManifest(): MediaManifest {
  return manifest as unknown as MediaManifest
}
