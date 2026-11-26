/** Shared social image: the aged-care hero. On a build without media the file is absent (accepted). */
export const OG_IMAGE = '/media/projects/aged-care-residence/render-1-1600.jpg'

/** Title, description, canonical URL and Open Graph / Twitter tags for one page. */
export function usePageSeo(o: { title: string; description: string; image?: string }) {
  const base = String(useRuntimeConfig().public.siteUrl).replace(/\/+$/, '')
  // Every URL ends in a slash (trailingSlash in nuxt.config); some routes report the path without it.
  const path = useRoute().path
  const url = base + (path.endsWith('/') ? path : `${path}/`)
  const image = base + (o.image ?? OG_IMAGE)
  const description = o.description.replace(/\s+/g, ' ').trim()
  useSeoMeta({
    title: o.title,
    description,
    ogTitle: o.title,
    ogDescription: description,
    ogImage: image,
    ogUrl: url,
    ogType: 'website',
    ogSiteName: 'John Louis Cabulao',
    twitterCard: 'summary_large_image',
    twitterTitle: o.title,
    twitterDescription: description,
    twitterImage: image,
  })
  useHead({ link: [{ rel: 'canonical', href: url }] })
}

/** Cut text at a word boundary to about `max` characters, for meta descriptions. */
export function clip(text: string, max = 158): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return t.slice(0, t.lastIndexOf(' ', max - 1)).replace(/[,;:—-]\s*$/, '') + '…'
}
