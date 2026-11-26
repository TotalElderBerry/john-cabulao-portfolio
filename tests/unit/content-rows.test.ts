import { describe, expect, it } from 'vitest'
import { projectRow } from '../../shared/content'
import { projectSchema } from '../../shared/schemas'

describe('projectRow', () => {
  const base = { slug: 's', public: true, title: 't', type: 'New build', tool: 'Cubit', trades: [], hero: 'Render 1.png', slider: { render: 'a', takeoff: 'b' }, gallery: [] }
  it('restores trim keys that Nuxt Content split at the file-extension dot', () => {
    const row = { ...base, trim: { '3D - Structural': { PNG: { x: 1, y: 2, w: 3, h: 4 } }, 'a.b': { c: { PNG: { x: 0, y: 0, w: 1, h: 1 } } } } }
    const p = projectSchema.parse(projectRow(row))
    expect(p.trim).toEqual({ '3D - Structural.PNG': { x: 1, y: 2, w: 3, h: 4 }, 'a.b.c.PNG': { x: 0, y: 0, w: 1, h: 1 } })
  })
  it('leaves already-flat trim and missing trim alone', () => {
    expect(projectRow({ ...base, trim: { 'x.PNG': { x: 1, y: 1, w: 1, h: 1 } } }).trim).toEqual({ 'x.PNG': { x: 1, y: 1, w: 1, h: 1 } })
    expect(projectSchema.parse(projectRow(base)).trim).toEqual({})
  })
})
