import { readdirSync, readFileSync } from 'node:fs'
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

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },
  modules: ['@nuxt/content'],
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
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500&display=swap' },
      ],
    },
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ['/', '/404.html', '/single-trade/', ...tradeRoutes, ...jobRoutes, '/multi-trade/', ...projectRoutes],
    },
  },
  runtimeConfig: {
    public: { formspreeId: '' },
  },
})
