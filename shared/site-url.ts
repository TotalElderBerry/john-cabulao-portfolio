export type SiteUrlEnv = {
  NUXT_PUBLIC_SITE_URL?: string
  VERCEL_PROJECT_PRODUCTION_URL?: string
  VERCEL_ENV?: string
}

/**
 * Public site URL, no trailing slash. Order: NUXT_PUBLIC_SITE_URL, then Vercel's production domain,
 * then https://example.com as a last resort. `warn` is true only when that last resort is used in a
 * production build, so the caller can log it (the build is never failed over it).
 */
export function resolveSiteUrl(env: SiteUrlEnv): { url: string; warn: boolean } {
  const explicit = env.NUXT_PUBLIC_SITE_URL?.trim()
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim().replace(/^https?:\/\//, '')
  const raw = explicit || (vercel ? `https://${vercel}` : '')
  const url = (raw || 'https://example.com').replace(/\/+$/, '')
  return { url, warn: !raw && env.VERCEL_ENV === 'production' }
}
