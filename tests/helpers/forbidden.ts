import { existsSync, readFileSync } from 'node:fs'
import { basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as yaml from 'js-yaml'

// Forbidden terms (client folder names, reference and company names seen on sheets) live only in the
// git-ignored sources.local.yml, so they never appear in this public repository.
export const sourcesFile = fileURLToPath(new URL('../../sources.local.yml', import.meta.url))

/** Folder basenames plus `forbiddenTerms:` from sources.local.yml, or null when the file is absent. */
export function loadForbiddenTerms(file = sourcesFile): string[] | null {
  if (!existsSync(file)) return null
  const sources = (yaml.load(readFileSync(file, 'utf8')) ?? {}) as Record<string, unknown>
  return [
    ...Object.entries(sources)
      .filter(([k, v]) => k !== 'forbiddenTerms' && typeof v === 'string')
      .map(([, v]) => basename(v as string)),
    ...((sources.forbiddenTerms as string[] | undefined) ?? []),
  ].filter(Boolean)
}

export const escapeRe = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Case-insensitive whole-word match, so short terms do not hit inside minified code or hashes. */
export const wholeWord = (term: string) => new RegExp(`(?<![A-Za-z0-9])${escapeRe(term)}(?![A-Za-z0-9])`, 'i')
