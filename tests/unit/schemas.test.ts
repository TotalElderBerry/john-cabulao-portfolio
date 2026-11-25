import { describe, it, expect } from 'vitest'
import { jobSchema, siteSchema, projectSchema } from '../../shared/schemas'

describe('schemas', () => {
  it('rejects a flagship without boq', () => expect(() => jobSchema.parse({ trade:'tiling', job:1, tool:'PlanSwift', flagship:true })).toThrow())
  it('rejects a rect outside the sheet', () => expect(() => jobSchema.parse({ trade:'tiling', job:1, tool:'PlanSwift', redact:[{x:90,y:0,w:20,h:5}] })).toThrow())
  it('defaults boqDownload to false', () => expect(jobSchema.parse({ trade:'tiling', job:1, tool:'PlanSwift' }).boqDownload).toBe(false))
  it('defaults public, flagship, redact, legend, boq', () => {
    expect(jobSchema.parse({ trade:'tiling', job:1, tool:'PlanSwift' })).toMatchObject({ public:false, flagship:false, redact:[], legend:[], boq:[] })
  })
  it('accepts a flagship with a boq line', () => {
    const boq = [{ ref:'A', description:'x', qty:1, unit:'m', sheet:1, hotspot:{ x:0, y:0, w:10, h:10 } }]
    expect(jobSchema.parse({ trade:'tiling', job:1, tool:'Cubit', flagship:true, boq }).flagship).toBe(true)
  })
  it('rejects an unknown trade', () => expect(() => jobSchema.parse({ trade:'plumbing', job:1, tool:'Cubit' })).toThrow())
  it('rejects zero-size rect', () => expect(() => jobSchema.parse({ trade:'tiling', job:1, tool:'Cubit', redact:[{x:0,y:0,w:0,h:5}] })).toThrow())
  it('site defaults formSuccess and project defaults trim', () => {
    const s = siteSchema.parse({ name:'a', role:'b', bio:'c', statement:'d', email:'e@x.com', phone:null, location:'l', software:[], credentials:[], services:[] })
    expect(s.formSuccess).toBe('Thanks — John will reply within one working day.')
    const p = projectSchema.parse({ slug:'s', title:'t', type:'ty', tool:'Cubit', trades:[], hero:'h', slider:{ render:'r', takeoff:'t' }, gallery:[] })
    expect(p.trim).toEqual({}); expect(p.public).toBe(false)
  })
})
