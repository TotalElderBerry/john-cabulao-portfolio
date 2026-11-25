import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { findSheetPdf, sourceFolderFor } from '../../scripts/assets/locate.mjs'

describe('locate', () => {
  it('derives the source folder', () =>
    expect(sourceFolderFor({ trade: 'carpentry', job: 10 })).toBe('SINGLE TRADES/3. CARPENTRY/JOB 10'))
  it('finds the markups pdf despite misspelt names', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'loc-'))
    writeFileSync(path.join(dir, 'Plasteing - JOB 1 (BOQ).pdf'), '')
    writeFileSync(path.join(dir, 'Plastering - JOB 1 (MARKUPS).pdf'), '')
    expect(path.basename((await findSheetPdf(dir))!)).toBe('Plastering - JOB 1 (MARKUPS).pdf')
  })
  it('returns null for an empty job folder', async () => {
    expect(await findSheetPdf(mkdtempSync(path.join(tmpdir(), 'loc-')))).toBeNull()
  })
})
