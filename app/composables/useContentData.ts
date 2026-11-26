import type { Job, Project, Site } from '~~/shared/schemas'
import { TRADES } from '~~/shared/trades'
import { publicOnly } from '~~/shared/jobs'
import { projectRow } from '~~/shared/content'

// Nuxt Content may skip zod defaults/refinements, so every result is re-parsed with the shared schemas.
// The schemas (and zod) are imported lazily: prerendered pages hydrate from the payload, so the browser
// only fetches them on a client-side navigation that actually queries content.
const schemas = () => import('~~/shared/schemas')

export async function useSite(): Promise<Site> {
  const { data } = await useAsyncData('site', async () => {
    const [row, { siteSchema }] = await Promise.all([queryCollection('site').first(), schemas()])
    return siteSchema.parse(row)
  })
  return data.value as Site
}

export async function useJobs(): Promise<Job[]> {
  const { data } = await useAsyncData('jobs', async () => {
    const [rows, { jobSchema }] = await Promise.all([queryCollection('singleTrade').all(), schemas()])
    return publicOnly(rows.map((r) => jobSchema.parse(r))).sort(
      (a, b) => TRADES.indexOf(a.trade) - TRADES.indexOf(b.trade) || a.job - b.job,
    )
  })
  return data.value ?? []
}

export async function useJob(trade: string, n: number): Promise<Job | null> {
  const { data } = await useAsyncData(`job-${trade}-${n}`, async () => {
    const [row, { jobSchema }] = await Promise.all([
      queryCollection('singleTrade').where('trade', '=', trade).where('job', '=', n).first(),
      schemas(),
    ])
    if (!row) return null
    const job = jobSchema.parse(row)
    return job.public ? job : null
  })
  return data.value ?? null
}

export async function useProjects(): Promise<Project[]> {
  const { data } = await useAsyncData('projects', async () => {
    const [rows, { projectSchema }] = await Promise.all([queryCollection('multiTrade').all(), schemas()])
    return publicOnly(rows.map((r) => projectSchema.parse(projectRow(r))))
  })
  return data.value ?? []
}

export async function useProject(slug: string): Promise<Project | null> {
  const { data } = await useAsyncData(`project-${slug}`, async () => {
    const [row, { projectSchema }] = await Promise.all([queryCollection('multiTrade').where('slug', '=', slug).first(), schemas()])
    if (!row) return null
    const project = projectSchema.parse(projectRow(row))
    return project.public ? project : null
  })
  return data.value ?? null
}
