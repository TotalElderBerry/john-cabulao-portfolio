import { TRADES, type Trade } from './trades'
import type { Job } from './schemas'

export { TRADES }
export type { Trade }

export function publicOnly<T extends { public: boolean }>(xs: T[]): T[] {
  return xs.filter((x) => x.public)
}

export function tradeCounts(jobs: Job[]): Record<Trade, number> & { all: number } {
  const counts = { all: 0 } as Record<Trade, number> & { all: number }
  for (const t of TRADES) counts[t] = 0
  for (const j of publicOnly(jobs)) {
    counts[j.trade]++
    counts.all++
  }
  return counts
}

export function jobPath(j: Pick<Job, 'trade' | 'job'>): string {
  return `/single-trade/${j.trade}/${j.job}/`
}

export function neighbours(jobs: Job[], current: Job): { prev: Job | null; next: Job | null } {
  const list = publicOnly(jobs)
    .filter((j) => j.trade === current.trade)
    .sort((a, b) => a.job - b.job)
  const prev = list.filter((j) => j.job < current.job).pop() ?? null
  const next = list.find((j) => j.job > current.job) ?? null
  return { prev, next }
}

/** Number part of a quantity: whole for ea/Item, else rounded to 2 dp. `fixed` keeps trailing zeros (BOQ tables: 72.60). */
export function formatNumber(n: number, unit: string, opts: { fixed?: boolean } = {}): string {
  if (unit === 'ea' || unit === 'Item') return String(Math.round(n))
  if (opts.fixed) return n.toFixed(2)
  let s = String(Math.round(n * 100) / 100)
  if (unit === 'm' && !s.includes('.')) s += '.0'
  return s
}

export function formatQty(n: number, unit: string): string {
  return `${formatNumber(n, unit)} ${unit}`
}

/** Manifest/media key for a job: `<trade>-<nn>`, e.g. `plastering-01`. */
export function jobId(j: Pick<Job, 'trade' | 'job'>): string {
  return `${j.trade}-${String(j.job).padStart(2, '0')}`
}
