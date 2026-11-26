// Scans the generated site in .output/public. `npm run check` runs `npm run generate` first; on a plain
// `vitest run` with no build output these tests are skipped (and say so).
import { existsSync, globSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadForbiddenTerms, wholeWord } from '../helpers/forbidden'

const out = resolve(__dirname, '../../.output/public')
const built = existsSync(resolve(out, 'index.html'))
const forbidden = loadForbiddenTerms()
const hero = resolve(out, 'media/projects/aged-care-residence/render-1-1600.webp')
const shipped = built ? globSync('**/*.{html,js,json,xml,txt}', { cwd: out }).map((f) => resolve(out, f)) : []
const read = (f: string) => readFileSync(f, 'utf8')
const page = (p: string) => read(resolve(out, p.replace(/^\//, ''), 'index.html'))

if (!built) console.warn('output-scan: .output/public not found, run `npm run generate` first; skipping')
if (built && !forbidden) console.warn('output-scan: sources.local.yml not found, skipping the client-name scan')
if (built && !existsSync(hero)) console.warn('output-scan: no media in this build, skipping the hero budget check')

describe.skipIf(!built)('generated output', () => {
  it('ships no source folder paths', () => {
    expect(shipped.length).toBeGreaterThan(50)
    const hits = shipped.filter((f) => /SINGLE TRADES\/|MULTI TRADES\//.test(read(f))).map((f) => f.slice(out.length))
    expect(hits).toEqual([])
  })

  it.skipIf(!forbidden)('ships no client names (terms from sources.local.yml, whole words)', () => {
    expect(forbidden!.length).toBeGreaterThan(0)
    const res = forbidden!.map(wholeWord)
    // Report file names only, never the term, so a failure log cannot leak it either.
    const hits = shipped.filter((f) => { const t = read(f); return res.some((re) => re.test(t)) }).map((f) => f.slice(out.length))
    expect(hits).toEqual([])
  })

  it.skipIf(!existsSync(hero))('keeps the hero image within budget', () => {
    expect(statSync(hero).size).toBeLessThanOrEqual(250 * 1024)
  })

  it('has a sitemap with every job', () => {
    expect(existsSync(resolve(out, 'sitemap.xml'))).toBe(true)
    const xml = read(resolve(out, 'sitemap.xml'))
    expect(xml.match(/\/single-trade\/[a-z]+\/\d+\//g)).toHaveLength(39)
    expect(xml).not.toMatch(/404|200\.html/)
  })

  it('has a robots.txt that points at the sitemap', () => {
    expect(existsSync(resolve(out, 'robots.txt'))).toBe(true)
    expect(read(resolve(out, 'robots.txt'))).toMatch(/^Sitemap: https?:\/\/\S+\/sitemap\.xml$/m)
  })

  it('gives every page a title, description, canonical and og:image', () => {
    for (const p of ['/', '/single-trade/', '/single-trade/plastering/', '/single-trade/plastering/1/', '/multi-trade/',
      '/multi-trade/aged-care-residence/', '/services/', '/about/', '/contact/']) {
      const html = page(p)
      const has = (re: RegExp) => re.test(html)
      // Compare flags, not the HTML, so a failure prints one line per page instead of the whole document.
      expect({
        p,
        title: has(/<title>[^<]{10,}<\/title>/),
        description: has(/<meta name="description" content="[^"]{30,}"/),
        canonical: has(new RegExp(`<link rel="canonical" href="https?://[^"/]+${p.replace(/\//g, '\\/')}"`)),
        ogImage: has(/<meta property="og:image" content="https?:\/\/[^"]+\/media\/projects\/aged-care-residence\/render-1-1600\.jpg"/),
        ogTitle: has(/<meta property="og:title" content="[^"]+"/),
      }).toEqual({ p, title: true, description: true, canonical: true, ogImage: true, ogTitle: true })
    }
  })

  it('describes John as a Person and ProfessionalService in JSON-LD, with no phone', () => {
    const m = page('/').match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)
    expect(m === null ? 'missing' : 'found').toBe('found')
    const ld = JSON.parse(m![1]!)
    const types = (ld['@graph'] ?? [ld]).map((n: { '@type': string }) => n['@type'])
    expect(types).toEqual(expect.arrayContaining(['Person', 'ProfessionalService']))
    expect(m![1]).toContain('John Louis Cabulao')
    expect(m![1]).not.toMatch(/telephone/)
  })
})
