import { readdirSync, readFileSync } from 'node:fs'
import { load } from 'js-yaml'

// Trades with at least one public job, read from content at config time.
const tradeRoutes = [
  ...new Set(
    readdirSync('content/single-trade')
      .filter((f) => f.endsWith('.yml'))
      .map((f) => load(readFileSync(`content/single-trade/${f}`, 'utf8')) as { trade: string; public?: boolean })
      .filter((j) => j.public === true)
      .map((j) => j.trade),
  ),
].map((t) => `/single-trade/${t}/`)

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
      routes: ['/', '/404.html', '/single-trade/', ...tradeRoutes],
      // Pages not built yet; the later tasks that build each page remove it from this list.
      ignore: ['/services/', '/about/', '/contact/', '/multi-trade/',
        // Job pages arrive in Task 8; remove in Task 8.
        /^\/single-trade\/[a-z]+\/\d+\/$/,
      ],
    },
  },
  runtimeConfig: {
    public: { formspreeId: '' },
  },
})
