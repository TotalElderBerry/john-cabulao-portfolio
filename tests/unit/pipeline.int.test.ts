import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp from 'sharp'
import { expect, it } from 'vitest'
import { redact, trim } from '../../scripts/assets/process.mjs'
import { renderPdfPages } from '../../scripts/assets/render.mjs'

const src = resolve(process.env.PORTFOLIO_SOURCE ?? '..')
const pdf = join(src, 'SINGLE TRADES/1. PLASTERING/JOB 1/Plastering - JOB 1 (MARKUPS).pdf')

it.skipIf(!existsSync(pdf))('renders plastering job 1 with a redaction', async () => {
  const pages = await renderPdfPages(pdf, 1600)
  expect(pages.length).toBeGreaterThanOrEqual(1)
  const out = await redact(pages[0], [{ x: 0, y: 90, w: 100, h: 10 }])
  const a = await sharp(pages[0]).metadata()
  const b = await sharp(out).metadata()
  expect([b.width, b.height]).toEqual([a.width, a.height])
  const { data } = await sharp(out).extract({ left: 10, top: b.height! - 5, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true })
  expect([...data.slice(0, 3)]).toEqual([255, 255, 255])
  const t = await sharp(await trim(pages[0], { x: 0, y: 0, w: 50, h: 50 })).metadata()
  expect(t.width).toBe(Math.floor(a.width! / 2))
}, 300_000)

it.skipIf(!existsSync(pdf))('renders at 3200px wide', async () => {
  const t0 = Date.now()
  const pages = await renderPdfPages(pdf, 3200)
  const m = await sharp(pages[0]).metadata()
  console.log(`3200px render: ${pages.length} page(s), ${m.width}x${m.height}, ${Date.now() - t0}ms`)
  expect(m.width).toBe(3200)
}, 600_000)
