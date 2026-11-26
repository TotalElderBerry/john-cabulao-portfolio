import { test, expect } from '@playwright/test'

test('filter links are real URLs with counts', async ({ page }) => {
  await page.goto('/single-trade/')
  await expect(page.locator('.tile')).toHaveCount(39)
  await page.getByRole('link', { name: /Plastering\s*20/ }).click()
  await expect(page).toHaveURL('/single-trade/plastering/')
  await expect(page.locator('.tile')).toHaveCount(20)
})

test('tiles link to job pages', async ({ page }) => {
  await page.goto('/single-trade/plastering/')
  await expect(page.locator('.tile').first()).toHaveAttribute('href', '/single-trade/plastering/1/')
})

test('home shows a 12-tile wall preview with a see-all link', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#wall .tile')).toHaveCount(12)
  await expect(page.getByRole('link', { name: /See all 39 jobs/ })).toHaveAttribute('href', '/single-trade/')
})

test('unknown trade and job return 404', async ({ page }) => {
  const r = await page.goto('/single-trade/plumbing/')
  expect(r?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: 'Not found' })).toBeVisible()
  expect((await page.goto('/single-trade/plastering/99/'))?.status()).toBe(404)
  expect((await page.goto('/single-trade/carpentry/7/'))?.status()).toBe(404)
})

test('captions are visible without hover on touch', async ({ browser }) => {
  const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 800 } })
  const page = await ctx.newPage()
  await page.goto('/single-trade/')
  const cap = page.locator('.tile .cap').first()
  const t = await cap.evaluate((el) => getComputedStyle(el).transform)
  expect(t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)').toBe(true)
  await ctx.close()
})
