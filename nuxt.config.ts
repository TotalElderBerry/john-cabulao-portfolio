export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },
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
    // failOnError off until Tasks 4-7 add the linked pages; restore then.
    prerender: { crawlLinks: true, failOnError: false, routes: ['/', '/404.html'] },
  },
  runtimeConfig: {
    public: { formspreeId: '' },
  },
})
