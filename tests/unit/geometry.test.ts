import { describe, expect, it } from 'vitest'
import { pctToPx } from '../../scripts/assets/geometry.mjs'

describe('geometry', () => {
  it('converts % rect to px and clamps', () => {
    expect(pctToPx({ x: 10, y: 20, w: 50, h: 50 }, 2000, 1000)).toEqual({ left: 200, top: 200, width: 1000, height: 500 })
    const r = pctToPx({ x: 90, y: 90, w: 10, h: 10 }, 999, 999)
    expect(r.left + r.width).toBeLessThanOrEqual(999)
    expect(r.top + r.height).toBeLessThanOrEqual(999)
  })
})
