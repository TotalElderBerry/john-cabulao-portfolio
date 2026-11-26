import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import * as yaml from 'js-yaml'
import { describe, expect, it } from 'vitest'
import { jobSchema, projectSchema, siteSchema } from '../../shared/schemas'
import { tradeCounts } from '../../shared/jobs'

const root = resolve(__dirname, '../../content')
const list = (dir: string) =>
  existsSync(join(root, dir)) ? readdirSync(join(root, dir)).filter((f) => f.endsWith('.yml')).map((f) => join(root, dir, f)) : []

const jobFiles = list('single-trade')
const projectFiles = list('multi-trade')
const siteFile = join(root, 'site.yml')
const read = (f: string) => readFileSync(f, 'utf8')
// Forbidden terms (client folder names, reference and company names seen on sheets) live only in the
// git-ignored sources.local.yml, so they never appear in this public repository.
const sourcesFile = resolve(__dirname, '../../sources.local.yml')
const sources = existsSync(sourcesFile) ? ((yaml.load(readFileSync(sourcesFile, 'utf8')) ?? {}) as Record<string, unknown>) : null
const forbiddenTerms = sources
  ? [
      ...Object.entries(sources)
        .filter(([k, v]) => k !== 'forbiddenTerms' && typeof v === 'string')
        .map(([, v]) => basename(v as string)),
      ...((sources.forbiddenTerms as string[] | undefined) ?? []),
    ].filter(Boolean)
  : []
const escape = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const jobs = jobFiles.map((f) => ({ ...jobSchema.parse(yaml.load(read(f))), __file: f }))
const projects = projectFiles.map((f) => projectSchema.parse(yaml.load(read(f))))
const allContentText = [...jobFiles, ...projectFiles, ...(existsSync(siteFile) ? [siteFile] : [])].map(read)

describe('content', () => {
  it('has 39 single-trade jobs with the right per-trade counts', () => {
    expect(jobs).toHaveLength(39)
    expect(tradeCounts(jobs.map((j) => ({ ...j, public: true })))).toMatchObject({
      plastering: 20,
      painting: 10,
      carpentry: 6,
      tiling: 2,
      masonry: 1,
    })
  })

  it('has at least three flagships including plastering and painting', () => {
    expect(jobs.filter((j) => j.flagship).length).toBeGreaterThanOrEqual(3)
    expect(jobs.filter((j) => j.flagship).map((j) => j.trade)).toEqual(expect.arrayContaining(['plastering', 'painting']))
    for (const j of jobs.filter((j) => j.flagship)) {
      expect(j.boq.length).toBeGreaterThanOrEqual(4)
      expect(j.boq.length).toBeLessThanOrEqual(8)
      const published = j.pages?.length ?? Infinity
      for (const b of j.boq) expect(b.sheet).toBeLessThanOrEqual(published)
    }
  })

  it('plastering-01 carries the mockup values', () => {
    const p1 = jobs.find((j) => j.trade === 'plastering' && j.job === 1)!
    expect(p1.flagship).toBe(true)
    expect(p1.legend).toEqual(expect.arrayContaining([expect.objectContaining({ qty: 101.5, unit: 'm' })]))
    expect(p1.boq.map((b) => [b.ref, b.qty])).toEqual(
      expect.arrayContaining([
        ['2.01', 335.05],
        ['2.03', 70.55],
        ['2.09', 72.6],
        ['2.11', 280.08],
      ]),
    )
  })

  if (!sources) console.warn('content.test: sources.local.yml not found, skipping the forbidden-terms check')
  it.skipIf(!sources)('never names a client (terms from sources.local.yml)', () => {
    expect(allContentText.length).toBeGreaterThan(0)
    expect(forbiddenTerms.length).toBeGreaterThan(0)
    const review = readFileSync(resolve(__dirname, '../../CONTENT-REVIEW.md'), 'utf8')
    for (const term of forbiddenTerms) {
      const re = new RegExp(escape(term), 'i')
      for (const f of [...allContentText, review]) expect(f).not.toMatch(re)
    }
  })

  it('has no source paths in content', () => {
    for (const f of allContentText) expect(f).not.toMatch(/^\s*source:/m)
  })

  it('names job files <trade>-<nn>.yml after the folder number', () => {
    for (const j of jobs) expect(basename(j.__file)).toBe(`${j.trade}-${String(j.job).padStart(2, '0')}.yml`)
  })

  it('has the three multi-trade projects', () => {
    expect(projects.map((p) => p.slug).sort()).toEqual(['aged-care-residence', 'community-pavilion', 'events-gallery-fitout'])
    expect(projects.find((p) => p.slug === 'aged-care-residence')!.hero).toBe('Render 1.png')
    for (const p of projects) expect(p.tool).toBe('Cubit')
  })

  it('has site copy with the four services and credentials', () => {
    const site = siteSchema.parse(yaml.load(read(siteFile)))
    expect(site.email).toBe('jlcabulao123456@gmail.com')
    expect(site.phone).toBeNull()
    expect(site.services.map((s) => s.title)).toEqual(['Single-trade BOQ', 'Multi-trade BOQ', 'Cost plan estimate', 'Quote vetting'])
    expect(site.credentials.join(' ')).toMatch(/Cum Laude/)
    expect(site.credentials.join(' ')).toMatch(/Costimate/)
    expect(site.software).toContain('PlanSwift')
    const ids = new Set(jobs.map((j) => `${j.trade}-${String(j.job).padStart(2, '0')}`))
    for (const s of site.services) if (s.example) expect(ids.has(s.example)).toBe(true)
  })
})
