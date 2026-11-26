import { describe, expect, it } from 'vitest'
import { resolveSiteUrl } from '../../shared/site-url'

describe('resolveSiteUrl', () => {
  it('prefers NUXT_PUBLIC_SITE_URL and trims trailing slashes', () => {
    expect(resolveSiteUrl({ NUXT_PUBLIC_SITE_URL: 'https://john.au//', VERCEL_PROJECT_PRODUCTION_URL: 'x.vercel.app' }))
      .toEqual({ url: 'https://john.au', warn: false })
  })
  it('falls back to the Vercel production domain', () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'site.vercel.app', VERCEL_ENV: 'production' }))
      .toEqual({ url: 'https://site.vercel.app', warn: false })
  })
  it('does not double the scheme if the Vercel value has one', () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'https://site.vercel.app' }).url).toBe('https://site.vercel.app')
  })
  it('uses example.com last, and warns only in a production build', () => {
    expect(resolveSiteUrl({})).toEqual({ url: 'https://example.com', warn: false })
    expect(resolveSiteUrl({ VERCEL_ENV: 'preview' }).warn).toBe(false)
    expect(resolveSiteUrl({ VERCEL_ENV: 'production' })).toEqual({ url: 'https://example.com', warn: true })
  })
  it('treats an empty NUXT_PUBLIC_SITE_URL as unset', () => {
    expect(resolveSiteUrl({ NUXT_PUBLIC_SITE_URL: '  ', VERCEL_PROJECT_PRODUCTION_URL: 'a.app' }).url).toBe('https://a.app')
  })
})
