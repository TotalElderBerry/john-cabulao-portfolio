import { defineCollection, defineContentConfig } from '@nuxt/content'
import { jobSchema, projectSchema, siteSchema } from './shared/schemas'

// Data collections only. Nuxt Content may skip zod defaults/refinements when it stores rows;
// pages re-parse what they read with the same schemas (shared/schemas.ts).
export default defineContentConfig({
  collections: {
    site: defineCollection({ type: 'data', source: 'site.yml', schema: siteSchema }),
    singleTrade: defineCollection({ type: 'data', source: 'single-trade/*.yml', schema: jobSchema }),
    multiTrade: defineCollection({ type: 'data', source: 'multi-trade/*.yml', schema: projectSchema }),
  },
})
