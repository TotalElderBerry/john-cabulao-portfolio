import { describe, expect, it } from 'vitest'
import { loupeStyle } from '../../shared/loupe'

describe('loupeStyle (mockup math)', () => {
  it('scales background to rect × zoom and centres the point', () => {
    const s = loupeStyle({ width: 800, height: 566 }, 200, 150, 3, 230)
    expect(s).toEqual({
      left: '200px',
      top: '150px',
      backgroundSize: '2400px 1698px',
      backgroundPosition: '-485px -335px',
    })
  })
  it('positions the origin so the loupe shows the sheet corner centred', () => {
    const s = loupeStyle({ width: 100, height: 100 }, 0, 0, 2, 200)
    expect(s.backgroundPosition).toBe('100px 100px')
  })
})
