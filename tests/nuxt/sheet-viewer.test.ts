import { describe, expect, it } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import SheetViewer from '~/components/work/SheetViewer.vue'
import LegendPanel from '~/components/work/LegendPanel.vue'

let manifest: any = { jobs: {}, projects: {} }
mockNuxtImport('useManifest', () => () => manifest)

describe('SheetViewer', () => {
  it('without media: placeholder only, no focus target, dialog or loupe', async () => {
    manifest = { jobs: {}, projects: {} }
    const w = await mountSuspended(SheetViewer, { props: { jobId: 'plastering-01' } })
    expect(w.find('.media-placeholder').exists()).toBe(true)
    expect(w.find('.sheet').attributes('tabindex')).toBeUndefined()
    expect(w.find('dialog').exists()).toBe(false)
    expect(w.find('.loupe').exists()).toBe(false)
  })
  it('with media: focusable sheet and a labelled dialog', async () => {
    manifest = { jobs: { 'plastering-01': { pages: 1, ratio: 1.414 } }, projects: {} }
    const w = await mountSuspended(SheetViewer, { props: { jobId: 'plastering-01' } })
    expect(w.find('.sheet').attributes('tabindex')).toBe('0')
    expect(w.find('dialog').attributes('aria-label')).toBe('Enlarged sheet')
    expect(w.find('.pager').exists()).toBe(false)
  })
  it('shows a page switcher when there is more than one page', async () => {
    manifest = { jobs: { 'plastering-01': { pages: 3, ratio: 1.414 } }, projects: {} }
    const w = await mountSuspended(SheetViewer, { props: { jobId: 'plastering-01', pages: 3 } })
    expect(w.findAll('.pager button')).toHaveLength(3)
  })
})

describe('LegendPanel', () => {
  it('formats quantities', async () => {
    const w = await mountSuspended(LegendPanel, { props: { items: [{ label: 'PT1', qty: 101.5, unit: 'm', color: '#000' }, { label: 'Door', qty: 2, unit: 'ea', color: '#111' }] } })
    expect(w.text()).toContain('101.5 m')
    expect(w.text()).toContain('2 ea')
  })
})
