import { describe, it, expect } from 'vitest'
import { zoomToRect } from '../../shared/zoom'

describe('zoomToRect', () => {
  it('centres and scales a rect', () => {
    const z = zoomToRect({ x: 10, y: 17, w: 24, h: 48 })
    expect(z.scale).toBeCloseTo(100 / (48 * 1.25), 3)
    expect(z.box.x + z.box.w / 2).toBeCloseTo(50, 3); expect(z.box.y + z.box.h / 2).toBeCloseTo(50, 3)
  })
  it('caps scale at maxScale', () => expect(zoomToRect({ x: 50, y: 50, w: 1, h: 1 }).scale).toBe(4))
})
