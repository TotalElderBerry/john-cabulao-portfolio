import { describe, it, expect } from 'vitest'
import { jobSchema } from '../../shared/schemas'
import { tradeCounts, neighbours, jobPath, formatQty } from '../../shared/jobs'

const j = (trade: string, job: number, pub = true) => jobSchema.parse({ trade, job, public: pub, tool: 'PlanSwift' })

describe('jobs', () => {
  it('counts public jobs per trade', () => {
    const c = tradeCounts([j('plastering',1), j('plastering',2,false), j('masonry',1)])
    expect(c).toMatchObject({ all: 2, plastering: 1, masonry: 1, painting: 0 })
  })
  it('neighbours skip unpublished and other trades', () => {
    const list = [j('plastering',1), j('plastering',2,false), j('plastering',3), j('painting',2)]
    const { prev, next } = neighbours(list, list[2])
    expect(prev?.job).toBe(1); expect(next).toBeNull()
  })
  it('keeps folder numbers in paths', () => expect(jobPath({ trade: 'plastering', job: 4 })).toBe('/single-trade/plastering/4/'))
  it.each([[101.5,'m','101.5 m'],[22,'ea','22 ea'],[335.05,'m²','335.05 m²'],[56,'m','56.0 m'],[1,'Item','1 Item']])('formats %s %s', (n,u,out) => expect(formatQty(n as number,u as string)).toBe(out))
})

import { jobId } from '../../shared/jobs'
describe('jobId', () => {
  it('pads the folder number to two digits', () => {
    expect(jobId({ trade: 'plastering', job: 1 })).toBe('plastering-01')
    expect(jobId({ trade: 'carpentry', job: 12 })).toBe('carpentry-12')
  })
})
