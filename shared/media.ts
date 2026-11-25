export interface JobMedia { pages: number; ratio: number }
export interface ProjectMedia { ratio: number }
export type MediaEntry = JobMedia | ProjectMedia
export interface MediaManifest {
  jobs: Record<string, JobMedia>
  projects: Record<string, Record<string, ProjectMedia>>
}

/** Look up generated media; null when it has not been generated (build still renders placeholders). */
export function mediaFor(manifest: MediaManifest, kind: 'jobs', key: string): JobMedia | null
export function mediaFor(manifest: MediaManifest, kind: 'projects', key: string, name: string): ProjectMedia | null
export function mediaFor(manifest: MediaManifest, kind: 'jobs' | 'projects', key: string, name?: string): MediaEntry | null
export function mediaFor(manifest: MediaManifest, kind: 'jobs' | 'projects', key: string, name?: string): MediaEntry | null {
  if (kind === 'jobs') return manifest.jobs?.[key] ?? null
  return manifest.projects?.[key]?.[name ?? ''] ?? null
}

export function srcset(base: string, widths: number[], ext: 'webp' | 'jpg'): string {
  return widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ')
}
