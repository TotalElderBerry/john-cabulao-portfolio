import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import MediaImg from '~/components/work/MediaImg.vue'

let manifest: any = { jobs: {}, projects: {} }
mockNuxtImport('useManifest', () => () => manifest)

describe('MediaImg', () => {
  it('renders a placeholder with the alt as label when media is missing', async () => {
    manifest = { jobs: {}, projects: {} }
    const w = await mountSuspended(MediaImg, { props: { kind: 'jobs', id: 'plastering-01', alt: 'Plan sheet' } })
    const ph = w.find('.media-placeholder')
    expect(ph.exists()).toBe(true)
    expect(ph.attributes('aria-label')).toBe('Plan sheet')
    expect(ph.attributes('role')).toBe('img')
    expect(ph.text()).toContain('Drawing available on request')
    expect(w.find('picture').exists()).toBe(false)
  })

  it('renders webp and jpg sources when the manifest has the job', async () => {
    manifest = { jobs: { 'plastering-01': { pages: 1, ratio: 1.414 } }, projects: {} }
    const w = await mountSuspended(MediaImg, { props: { kind: 'jobs', id: 'plastering-01', alt: 'Plan sheet' } })
    const src = w.find('source[type="image/webp"]')
    expect(src.attributes('srcset')).toContain('p1-640.webp 640w')
    expect(w.find('source[type="image/jpeg"]').attributes('srcset')).toContain('p1-640.jpg 640w')
    const img = w.find('img')
    expect(img.attributes('loading')).toBe('lazy')
    expect(img.attributes('width')).toBe('1600')
    expect(img.attributes('height')).toBe('1132')
  })

  it('uses project names and priority loading', async () => {
    manifest = { jobs: {}, projects: { 'p-one': { 'render-1': { ratio: 2 } } } }
    const w = await mountSuspended(MediaImg, { props: { kind: 'projects', id: 'p-one', name: 'render-1', alt: 'r', priority: true } })
    expect(w.find('source[type="image/webp"]').attributes('srcset')).toContain('/media/projects/p-one/render-1-800.webp 800w')
    const img = w.find('img')
    expect(img.attributes('loading')).toBe('eager')
    expect(img.attributes('fetchpriority')).toBe('high')
    expect(img.attributes('height')).toBe('800')
  })

  it('defers the picture until it nears the viewport, holding its box meanwhile', async () => {
    manifest = { jobs: {}, projects: { 'p-one': { 'render-1': { ratio: 2 } } } }
    let fire: (entries: { isIntersecting: boolean }[]) => void = () => {}
    const observed: Element[] = []
    globalThis.IntersectionObserver = class {
      constructor(cb: typeof fire) { fire = cb }
      observe(el: Element) { observed.push(el) }
      disconnect() {}
      unobserve() {}
    } as unknown as typeof IntersectionObserver
    const w = await mountSuspended(MediaImg, { props: { kind: 'projects', id: 'p-one', name: 'render-1', alt: 'r', defer: true } })
    expect(w.find('picture').exists()).toBe(false)
    const box = w.find('.media-pending')
    expect(box.exists()).toBe(true)
    expect(box.attributes('style')).toContain('aspect-ratio: 2')
    expect(observed).toHaveLength(1)
    fire([{ isIntersecting: true }])
    await nextTick()
    expect(w.find('picture img').attributes('loading')).toBe('lazy')
  })
})
