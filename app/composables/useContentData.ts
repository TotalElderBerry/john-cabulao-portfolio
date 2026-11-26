import { TRADES, jobSchema, projectSchema, siteSchema, type Job, type Project, type Site } from '~~/shared/schemas'
import { publicOnly } from '~~/shared/jobs'

// Nuxt Content may skip zod defaults/refinements, so every result is re-parsed with the shared schemas.

export async function useSite(): Promise<Site> {
  const { data } = await useAsyncData('site', async () => siteSchema.parse(await queryCollection('site').first()))
  return data.value as Site
}

export async function useJobs(): Promise<Job[]> {
  const { data } = await useAsyncData('jobs', async () => {
    const rows = await queryCollection('singleTrade').all()
    return publicOnly(rows.map((r) => jobSchema.parse(r))).sort(
      (a, b) => TRADES.indexOf(a.trade) - TRADES.indexOf(b.trade) || a.job - b.job,
    )
  })
  return data.value ?? []
}

export async function useJob(trade: string, n: number): Promise<Job | null> {
  const { data } = await useAsyncData(`job-${trade}-${n}`, async () => {
    const row = await queryCollection('singleTrade').where('trade', '=', trade).where('job', '=', n).first()
    if (!row) return null
    const job = jobSchema.parse(row)
    return job.public ? job : null
  })
  return data.value ?? null
}

export async function useProjects(): Promise<Project[]> {
  const { data } = await useAsyncData('projects', async () => {
    const rows = await queryCollection('multiTrade').all()
    return publicOnly(rows.map((r) => projectSchema.parse(r)))
  })
  return data.value ?? []
}

export async function useProject(slug: string): Promise<Project | null> {
  const { data } = await useAsyncData(`project-${slug}`, async () => {
    const row = await queryCollection('multiTrade').where('slug', '=', slug).first()
    if (!row) return null
    const project = projectSchema.parse(row)
    return project.public ? project : null
  })
  return data.value ?? null
}
