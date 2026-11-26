// Prerendered to /robots.txt with the configured site URL.
export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return `User-agent: *\nAllow: /\n\nSitemap: ${String(siteUrl).replace(/\/+$/, '')}/sitemap.xml\n`
})
