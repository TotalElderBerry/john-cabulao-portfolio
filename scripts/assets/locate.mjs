import { readdir } from 'node:fs/promises'
import path from 'node:path'

const TRADES = ['plastering', 'painting', 'carpentry', 'tiling', 'masonry']

/** e.g. { trade: 'plastering', job: 4 } -> 'SINGLE TRADES/1. PLASTERING/JOB 4' */
export function sourceFolderFor(j) {
  const i = TRADES.indexOf(j.trade)
  if (i < 0) throw new Error(`Unknown trade: ${j.trade}`)
  return `SINGLE TRADES/${i + 1}. ${j.trade.toUpperCase()}/JOB ${j.job}`
}

async function list(folder) {
  try {
    return (await readdir(folder)).sort()
  } catch {
    return []
  }
}

/** First *.pdf whose name contains MARKUPS (case-insensitive), or null. */
export async function findSheetPdf(folder) {
  const hit = (await list(folder)).find((f) => /\.pdf$/i.test(f) && /markups/i.test(f))
  return hit ? path.join(folder, hit) : null
}

/** Find a file by case-insensitive name; returns full path or null. */
export async function findFile(folder, name) {
  const hit = (await list(folder)).find((f) => f.toLowerCase() === name.toLowerCase())
  return hit ? path.join(folder, hit) : null
}
