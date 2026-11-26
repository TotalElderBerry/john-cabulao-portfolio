import { describe, expect, it } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import BoqLink from '~/components/work/BoqLink.vue'
import { zoomToRect } from '~~/shared/zoom'

let manifest: any = { jobs: { 'plastering-01': { pages: 1, ratio: 1.414 } }, projects: {} }
mockNuxtImport('useManifest', () => () => manifest)

const lines = [
  { ref: '2.01', description: 'PT1 walls', qty: 335.05, unit: 'm²', note: 'Measured on plan: 101.5 m', sheet: 1, hotspot: { x: 14, y: 18.5, w: 8.5, h: 43 } },
  { ref: '2.03', description: 'PT2 walls', qty: 70.55, unit: 'm²', sheet: 1, hotspot: { x: 40, y: 21.5, w: 15.2, h: 11.5 } },
]

describe('BoqLink', () => {
  it('zooms to the hotspot, announces the note, and resets', async () => {
    manifest = { jobs: { 'plastering-01': { pages: 1, ratio: 1.414 } }, projects: {} }
    const w = await mountSuspended(BoqLink, { props: { jobId: 'plastering-01', lines, ratio: 1.414 } })
    expect(w.text()).toContain('From drawing to line item.')
    const btns = w.findAll('button.line')
    expect(btns).toHaveLength(2)
    await btns[0]!.trigger('click')
    expect(btns[0]!.attributes('aria-pressed')).toBe('true')
    const stage = w.find('[data-stage]')
    const z = zoomToRect(lines[0]!.hotspot)
    expect(stage.attributes('style')).toContain(`scale(${z.scale.toFixed(3)})`)
    expect(w.find('[aria-live="polite"]').text()).toBe('Measured on plan: 101.5 m')
    await btns[1]!.trigger('click')
    expect(w.find('[aria-live="polite"]').text()).toBe('PT2 walls')
    await w.findAll('button').find((b) => b.text() === 'Whole sheet')!.trigger('click')
    expect(stage.attributes('style') ?? '').not.toContain('transform')
    expect(btns[1]!.attributes('aria-pressed')).toBe('false')
  })

  it('lists lines without transform when media is missing', async () => {
    manifest = { jobs: {}, projects: {} }
    const w = await mountSuspended(BoqLink, { props: { jobId: 'plastering-01', lines, ratio: 1.414 } })
    await w.findAll('button.line')[0]!.trigger('click')
    expect(w.findAll('button.line')).toHaveLength(2)
    expect(w.find('[data-stage]').attributes('style') ?? '').not.toContain('transform')
  })
})
