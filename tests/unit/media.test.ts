import { describe, expect, it } from 'vitest'
import { mediaFor, srcset } from '../../shared/media'

describe('media', () => {
  it('returns null when media has not been generated', () =>
    expect(mediaFor({ jobs: {}, projects: {} }, 'jobs', 'plastering-01')).toBeNull())
  it('returns entries when present', () => {
    const m = { jobs: { 'plastering-01': { pages: 2, ratio: 1.4 } }, projects: { a: { 'render-1': { ratio: 1.5 } } } }
    expect(mediaFor(m, 'jobs', 'plastering-01')).toEqual({ pages: 2, ratio: 1.4 })
    expect(mediaFor(m, 'projects', 'a', 'render-1')).toEqual({ ratio: 1.5 })
    expect(mediaFor(m, 'projects', 'a', 'nope')).toBeNull()
  })
  it('builds a srcset', () =>
    expect(srcset('/media/jobs/plastering-01/p1', [640, 1600], 'webp')).toBe(
      '/media/jobs/plastering-01/p1-640.webp 640w, /media/jobs/plastering-01/p1-1600.webp 1600w'))
})
