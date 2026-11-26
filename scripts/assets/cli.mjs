// Run with tsx (imports the TS zod schemas directly): npm run assets [-- --only plastering-01] [--force]
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as yaml from 'js-yaml'
import sharp from 'sharp'
import { jobId } from '../../shared/jobs.ts'
import { kebab } from '../../shared/media.ts'
import { jobSchema, projectSchema } from '../../shared/schemas.ts'
import { findFile, findSheetPdf, sourceFolderFor } from './locate.mjs'
import { redact, trim, writeSizes } from './process.mjs'
import { publishPlan, rectsForPage } from './pages.mjs'
import { renderPdfPages } from './render.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const SOURCE = path.resolve(ROOT, process.env.PORTFOLIO_SOURCE ?? '..')
const OUT = path.join(ROOT, 'public/media')
const MANIFEST = path.join(ROOT, 'data/media-manifest.json')
const CACHE = path.join(ROOT, '.data/assets-cache.json')
const JOB_WIDTHS = [640, 1600, 3200]
const PROJECT_WIDTHS = [800, 1600, 2400]

const args = process.argv.slice(2)
const force = args.includes('--force')
const onlyIdx = args.indexOf('--only')
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null

const sha = (s) => createHash('sha256').update(s).digest('hex')
const readJson = async (p, fallback) => {
  try {
    return JSON.parse(await readFile(p, 'utf8'))
  } catch {
    return fallback
  }
}

async function readYamlDir(dir) {
  let files = []
  try {
    files = (await readdir(dir)).filter((f) => /\.ya?ml$/.test(f)).sort()
  } catch {}
  return Promise.all(
    files.map(async (f) => {
      const text = await readFile(path.join(dir, f), 'utf8')
      return { text, data: yaml.load(text) }
    }),
  )
}

const manifest = await readJson(MANIFEST, { jobs: {}, projects: {} })
manifest.jobs ??= {}
manifest.projects ??= {}
const cache = await readJson(CACHE, {})
const skipped = []
let processed = 0

// ---- single-trade jobs
const jobFiles = await readYamlDir(path.join(ROOT, 'content/single-trade'))
const seenJobs = new Set()
for (const { text, data } of jobFiles) {
  const job = jobSchema.parse(data)
  const key = jobId(job)
  seenJobs.add(key)
  if (only && only !== key) continue
  const outDir = path.join(OUT, 'jobs', key)
  if (!job.public) {
    await rm(outDir, { recursive: true, force: true })
    delete manifest.jobs[key]
    delete cache[`jobs/${key}`]
    skipped.push(`${key}: not public`)
    continue
  }
  const folder = path.join(SOURCE, sourceFolderFor(job))
  if (!existsSync(folder)) {
    skipped.push(`${key}: missing source folder`)
    continue
  }
  const pdf = await findSheetPdf(folder)
  if (!pdf) {
    skipped.push(`${key}: no markups pdf`)
    continue
  }
  const stamp = { mtime: (await stat(pdf)).mtimeMs, hash: sha(text) }
  const prev = cache[`jobs/${key}`]
  if (!force && prev && prev.mtime === stamp.mtime && prev.hash === stamp.hash && manifest.jobs[key]) {
    skipped.push(`${key}: unchanged`)
    continue
  }
  const t0 = Date.now()
  const pages = await renderPdfPages(pdf, 3200)
  await rm(outDir, { recursive: true, force: true })
  const plan = publishPlan(pages.length, job.pages)
  let ratio = 1
  for (const { source, out } of plan) {
    const img = await redact(pages[source - 1], rectsForPage(job.redact, source))
    const r = await writeSizes(img, path.join(outDir, `p${out}`), JOB_WIDTHS)
    if (out === 1) ratio = r
  }
  for (const c of pages.capped) console.warn(`${key}: page ${c.page} width capped to ${c.width}px (60MP limit)`)
  manifest.jobs[key] = { pages: plan.length, ratio }
  cache[`jobs/${key}`] = stamp
  processed++
  console.log(`${key}: ${plan.length} of ${pages.length} page(s) in ${Date.now() - t0}ms`)
}
if (!only) {
  for (const key of Object.keys(manifest.jobs)) {
    if (!seenJobs.has(key)) {
      await rm(path.join(OUT, 'jobs', key), { recursive: true, force: true })
      delete manifest.jobs[key]
      delete cache[`jobs/${key}`]
    }
  }
}

// ---- multi-trade projects
let sources = {}
try {
  sources = yaml.load(await readFile(path.join(ROOT, 'sources.local.yml'), 'utf8')) ?? {}
} catch {}
const projFiles = await readYamlDir(path.join(ROOT, 'content/multi-trade'))
const seenProjects = new Set()
for (const { text, data } of projFiles) {
  const project = projectSchema.parse(data)
  const slug = project.slug
  seenProjects.add(slug)
  if (only && only !== slug) continue
  const outDir = path.join(OUT, 'projects', slug)
  if (!project.public) {
    await rm(outDir, { recursive: true, force: true })
    delete manifest.projects[slug]
    delete cache[`projects/${slug}`]
    skipped.push(`${slug}: not public`)
    continue
  }
  if (!sources[slug]) {
    skipped.push(`${slug}: not in sources.local.yml`)
    continue
  }
  const folder = path.join(SOURCE, sources[slug])
  if (!existsSync(folder)) {
    skipped.push(`${slug}: missing source folder`)
    continue
  }
  const names = [...new Set([project.hero, project.slider.render, project.slider.takeoff, ...project.gallery.map((g) => g.file)])]
  const found = []
  let missing = null
  for (const file of names) {
    const p = await findFile(folder, file)
    if (!p) {
      missing = file
      break
    }
    found.push({ file, p })
  }
  if (missing) {
    skipped.push(`${slug}: missing image ${kebab(missing)}`)
    continue
  }
  const mtime = Math.max(...(await Promise.all(found.map(async (f) => (await stat(f.p)).mtimeMs))))
  const stamp = { mtime, hash: sha(text) }
  const prev = cache[`projects/${slug}`]
  if (!force && prev && prev.mtime === stamp.mtime && prev.hash === stamp.hash && manifest.projects[slug]) {
    skipped.push(`${slug}: unchanged`)
    continue
  }
  await rm(outDir, { recursive: true, force: true })
  const entry = {}
  for (const { file, p } of found) {
    let img = await sharp(p).png().toBuffer()
    if (project.trim[file]) img = await trim(img, project.trim[file])
    const ratio = await writeSizes(img, path.join(outDir, kebab(file)), PROJECT_WIDTHS)
    entry[kebab(file)] = { ratio }
  }
  manifest.projects[slug] = entry
  cache[`projects/${slug}`] = stamp
  processed++
  console.log(`${slug}: ${found.length} image(s)`)
}
if (!only) {
  for (const slug of Object.keys(manifest.projects)) {
    if (!seenProjects.has(slug)) {
      await rm(path.join(OUT, 'projects', slug), { recursive: true, force: true })
      delete manifest.projects[slug]
      delete cache[`projects/${slug}`]
    }
  }
}

await mkdir(path.dirname(CACHE), { recursive: true })
await writeFile(CACHE, JSON.stringify(cache, null, 2))
await mkdir(path.dirname(MANIFEST), { recursive: true })
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`processed ${processed}, skipped ${skipped.length}${skipped.length ? ` (${skipped.join('; ')})` : ''}`)
