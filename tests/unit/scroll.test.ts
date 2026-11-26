import { describe, expect, it } from 'vitest'
import { progressFor } from '../../app/composables/useScrollProgress'
import { splitStatement } from '../../shared/text'

describe('progressFor', () => {
  it.each([[0, 1000, 800, 0], [-100, 1000, 800, 0.5], [-400, 1000, 800, 1], [300, 1000, 800, 0]])(
    'progressFor(%i,%i,%i)=%f',
    (t, h, v, p) => expect(progressFor(t, h, v)).toBeCloseTo(p),
  )
  it('treats a section no taller than the viewport as done once its top passes', () => {
    expect(progressFor(10, 800, 800)).toBe(0)
    expect(progressFor(0, 800, 800)).toBe(1)
  })
})

describe('splitStatement', () => {
  it('splits words and marks *asterisk* groups as highlights', () => {
    expect(splitStatement('I measure *wall,* and *square metre* here')).toEqual([
      { text: 'I', hl: false },
      { text: 'measure', hl: false },
      { text: 'wall,', hl: true },
      { text: 'and', hl: false },
      { text: 'square', hl: true },
      { text: 'metre', hl: true },
      { text: 'here', hl: false },
    ])
  })
  it('leaves plain text unhighlighted and ignores extra whitespace', () => {
    expect(splitStatement('  a  b ')).toEqual([{ text: 'a', hl: false }, { text: 'b', hl: false }])
  })
})
