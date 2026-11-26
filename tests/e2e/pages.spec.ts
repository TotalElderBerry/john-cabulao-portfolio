import { test, expect } from '@playwright/test'
import { loadForbiddenTerms, wholeWord } from '../helpers/forbidden'

// Client and reference names come from the git-ignored sources.local.yml, never from this public repo.
const forbidden = loadForbiddenTerms()

test('about lists credentials from the resume', async ({ page }) => {
  await page.goto('/about/')
  await expect(page.locator('main')).toContainText('Cum Laude')
  await expect(page.locator('main')).toContainText('Costimate')
  await expect(page.locator('main')).toContainText('A&D 7710')
})
test('about names no client or reference (terms from sources.local.yml)', async ({ page }) => {
  test.skip(!forbidden, 'sources.local.yml not found')
  await page.goto('/about/')
  const text = await page.locator('main').innerText()
  expect(forbidden!.filter((t) => wholeWord(t).test(text)).length).toBe(0)
})
test('services lists the four services', async ({ page }) => {
  await page.goto('/services/')
  for (const s of ['Single-trade BOQ', 'Multi-trade BOQ', 'Cost plan', 'Quote vetting'])
    await expect(page.getByRole('heading', { name: new RegExp(s, 'i') })).toBeVisible()
  await expect(page.getByRole('heading', { name: /how it works/i })).toBeVisible()
  await expect(page.locator('a[href^="/single-trade/plastering/"]').first()).toBeVisible()
})
test('contact page without a form id leads with the email, copy button and no form', async ({ page }) => {
  await page.goto('/contact/')
  await expect(page.getByText('Email your drawings or a download link to John.')).toBeVisible()
  await expect(page.locator('.addr')).toContainText('@')
  await expect(page.getByRole('button', { name: /copy/i })).toBeVisible()
  await expect(page.locator('form')).toHaveCount(0)
  await expect(page.locator('input[type="file"]')).toHaveCount(0)
})
