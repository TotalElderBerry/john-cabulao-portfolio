import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { load } from 'js-yaml'
import { jobPath } from './shared/jobs'

// Public jobs, read from content at config time.
const publicJobs = readdirSync('content/single-trade')
  .filter((f) => f.endsWith('.yml'))
  .map((f) => load(readFileSync(`content/single-trade/${f}`, 'utf8')) as { trade: string; job: number; public?: boolean })
  .filter((j) => j.public === true)
// Trades with at least one public job.
const tradeRoutes = [...new Set(publicJobs.map((j) => j.trade))].map((t) => `/single-trade/${t}/`)
const jobRoutes = publicJobs.map((j) => jobPath(j as Parameters<typeof jobPath>[0]))

const projectRoutes = readdirSync('content/multi-trade')
  .filter((f) => f.endsWith('.yml'))
  .map((f) => load(readFileSync(`content/multi-trade/${f}`, 'utf8')) as { slug: string; public?: boolean })
  .filter((p) => p.public === true)
  .map((p) => `/multi-trade/${p.slug}/`)

// Public site URL for canonical/og URLs, the sitemap and robots.txt.
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://example.com').replace(/\/+$/, '')
// No media: public/media is git-ignored, so a deploy from the public repo has the manifest but no files.
// Then every image renders its placeholder. NUXT_PUBLIC_NO_MEDIA=1 forces this (tests/e2e/no-media.spec.ts)
// and builds into separate .nuxt-no-media / .output-no-media folders so the normal build is untouched.
const forceNoMedia = process.env.NUXT_PUBLIC_NO_MEDIA === '1'
const noMedia = forceNoMedia || !existsSync('public/media')

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },
  modules: ['@nuxt/content', '@nuxtjs/sitemap'],
  ...(forceNoMedia ? { buildDir: '.nuxt-no-media' } : {}),
  site: { url: siteUrl, name: 'John Louis Cabulao', trailingSlash: true },
  sitemap: {
    // Every prerendered page, listed explicitly so no job depends on the crawler finding it.
    urls: ['/', '/single-trade/', ...tradeRoutes, ...jobRoutes, '/multi-trade/', ...projectRoutes, '/services/', '/about/', '/contact/'],
    exclude: ['/404.html', '/200.html'],
    autoLastmod: false,
  },
  content: {
    // Node's built-in node:sqlite, so no native sqlite package is needed at build time.
    experimental: { sqliteConnector: 'native' },
  },
  ssr: true,
  css: ['~/assets/css/tokens.css', '~/assets/css/base.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'color-scheme', content: 'light' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // The Manrope stylesheet itself is added non-blocking by server/plugins/fonts.ts.
      ],
    },
  },
  nitro: {
    ...(forceNoMedia ? { output: { dir: '.output-no-media' } } : {}),
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ['/', '/404.html', '/robots.txt', '/single-trade/', ...tradeRoutes, ...jobRoutes, '/multi-trade/', ...projectRoutes],
    },
  },
  runtimeConfig: {
    public: { formspreeId: '', siteUrl, noMedia },
  },
})
