// Lighthouse (mobile) gate: every category >= 0.9 and LCP <= 2500 ms on three representative pages.
// Each URL runs LH_RUNS times (default 3) and is judged on Lighthouse's own median run, because simulated
// LCP varies a few hundred ms between runs. Full reports are written to .lighthouse/.
// Serves the current .output/public on its own port (run `npm run generate` first; `npm run check` does).
// Chrome: chrome-launcher finds a system Chrome; otherwise CHROME_PATH falls back to Playwright's Chromium.
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { setTimeout as sleep } from 'node:timers/promises'
import lighthouse from 'lighthouse'
import { computeMedianRun } from 'lighthouse/core/lib/median-run.js'
import * as chromeLauncher from 'chrome-launcher'

const PORT = Number(process.env.LH_PORT || 4180)
const BASE = `http://localhost:${PORT}`
const URLS = ['/', '/multi-trade/aged-care-residence/', '/single-trade/plastering/1/']
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo']
const MIN_SCORE = 0.9
const MAX_LCP = 2500
const RUNS = Number(process.env.LH_RUNS || 3)
const OUT = '.lighthouse'

if (!existsSync('.output/public/index.html')) {
  console.error('check-lighthouse: .output/public is missing, run `npm run generate` first')
  process.exit(1)
}

async function usePlaywrightChromium() {
  const { chromium } = await import('playwright-core')
  process.env.CHROME_PATH = chromium.executablePath()
}
async function launchChrome() {
  const opts = { chromeFlags: ['--headless=new', '--no-sandbox'] }
  if (!process.env.CHROME_PATH) {
    let installed = null
    try { installed = chromeLauncher.Launcher.getFirstInstallation() } catch {}
    if (installed) {
      try { return await chromeLauncher.launch(opts) } catch (e) { console.warn(`system Chrome failed to start (${e.message}); using Playwright's Chromium`) }
    }
    await usePlaywrightChromium()
  }
  return chromeLauncher.launch(opts)
}

const server = spawn(process.execPath, ['scripts/preview.mjs'], { env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' })
let chrome
let failed = false
try {
  for (let i = 0; ; i++) {
    try { if ((await fetch(BASE + '/')).ok) break } catch {}
    if (i > 50) throw new Error('preview server did not start')
    await sleep(100)
  }
  chrome = await launchChrome()
  const rows = []
  for (const path of URLS) {
    // Lighthouse's default config is mobile (Moto G Power emulation, slow 4G throttling).
    const runs = []
    for (let i = 0; i < RUNS; i++) {
      runs.push((await lighthouse(BASE + path, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: CATEGORIES })).lhr)
    }
    const lhr = computeMedianRun(runs)
    const lcps = runs.map((r) => Math.round(r.audits['largest-contentful-paint'].numericValue))
    mkdirSync(OUT, { recursive: true })
    writeFileSync(`${OUT}/${path.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'home'}.json`, JSON.stringify(lhr))
    const scores = Object.fromEntries(CATEGORIES.map((c) => [c, lhr.categories[c].score]))
    const lcp = Math.round(lhr.audits['largest-contentful-paint'].numericValue)
    const bad = [
      ...CATEGORIES.filter((c) => !(scores[c] >= MIN_SCORE)).map((c) => `${c} ${scores[c]}`),
      ...(lcp > MAX_LCP ? [`LCP ${lcp} ms`] : []),
    ]
    if (bad.length) {
      failed = true
      for (const c of CATEGORIES) {
        for (const ref of lhr.categories[c].auditRefs) {
          const a = lhr.audits[ref.id]
          if (ref.weight > 0 && a.score !== null && a.score < 1) console.log(`    ${c} / ${a.id}: ${a.score} ${a.displayValue ?? ''}`)
        }
      }
    }
    rows.push({ path, ...Object.fromEntries(CATEGORIES.map((c) => [c, Math.round(scores[c] * 100)])), lcp, runs: lcps.join(' / '), ok: bad.length ? `FAIL: ${bad.join(', ')}` : 'ok' })
  }
  console.table(rows)
  writeFileSync(`${OUT}/summary.json`, JSON.stringify(rows, null, 2))
} catch (e) {
  failed = true
  console.error(e)
} finally {
  await chrome?.kill()
  server.kill()
}
process.exit(failed ? 1 : 0)
