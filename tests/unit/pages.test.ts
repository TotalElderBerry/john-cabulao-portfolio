import { describe, expect, it } from 'vitest'
import { publishPlan, rectsForPage } from '../../scripts/assets/pages.mjs'
import { jobSchema } from '../../shared/schemas'

describe('page-scoped redaction', () => {
  const redact = [
    { x: 0, y: 0, w: 10, h: 10, page: 1 },
    { x: 20, y: 20, w: 10, h: 10, page: 3 },
    { x: 40, y: 40, w: 10, h: 10, page: 3 },
  ]
  it('applies only the rects for that original page', () => {
    expect(rectsForPage(redact, 1)).toEqual([{ x: 0, y: 0, w: 10, h: 10 }])
    expect(rectsForPage(redact, 2)).toEqual([])
    expect(rectsForPage(redact, 3)).toHaveLength(2)
  })
  it('treats a rect without a page as page 1', () => {
    expect(rectsForPage([{ x: 1, y: 1, w: 1, h: 1 }], 1)).toHaveLength(1)
    expect(rectsForPage([{ x: 1, y: 1, w: 1, h: 1 }], 2)).toHaveLength(0)
  })
  it('schema defaults redact page to 1 and rejects page 0', () => {
    const j = jobSchema.parse({ trade: 'tiling', job: 1, tool: 'PlanSwift', redact: [{ x: 0, y: 0, w: 5, h: 5 }] })
    expect(j.redact[0].page).toBe(1)
    expect(() => jobSchema.parse({ trade: 'tiling', job: 1, tool: 'PlanSwift', redact: [{ x: 0, y: 0, w: 5, h: 5, page: 0 }] })).toThrow()
  })
})

describe('page allow-list', () => {
  it('publishes every page by default, numbered 1..n', () => {
    expect(publishPlan(3, undefined)).toEqual([
      { source: 1, out: 1 },
      { source: 2, out: 2 },
      { source: 3, out: 3 },
    ])
  })
  it('renumbers allowed pages sequentially in allow-list order', () => {
    expect(publishPlan(6, [1, 4, 2])).toEqual([
      { source: 1, out: 1 },
      { source: 4, out: 2 },
      { source: 2, out: 3 },
    ])
  })
  it('rejects pages outside the document and duplicates', () => {
    expect(() => publishPlan(3, [1, 5])).toThrow()
    expect(() => publishPlan(3, [2, 2])).toThrow()
  })
  it('schema accepts an optional pages list', () => {
    expect(jobSchema.parse({ trade: 'tiling', job: 1, tool: 'PlanSwift', pages: [1, 3] }).pages).toEqual([1, 3])
    expect(jobSchema.parse({ trade: 'tiling', job: 1, tool: 'PlanSwift' }).pages).toBeUndefined()
    expect(() => jobSchema.parse({ trade: 'tiling', job: 1, tool: 'PlanSwift', pages: [] })).toThrow()
  })
})
