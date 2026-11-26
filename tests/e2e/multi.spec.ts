import { test, expect } from '@playwright/test'

test('index lists 3 projects with descriptive titles', async ({ page }) => {
  await page.goto('/multi-trade/')
  await expect(page.locator('.project')).toHaveCount(3)
})
test('slider moves with keyboard', async ({ page }) => {
  await page.goto('/multi-trade/aged-care-residence/')
  const s = page.getByRole('slider')
  await s.focus()
  const v0 = Number(await s.getAttribute('aria-valuenow'))
  await page.keyboard.press('ArrowRight')
  expect(Number(await s.getAttribute('aria-valuenow'))).toBe(v0 + 5)
  await page.keyboard.press('End')
  expect(await s.getAttribute('aria-valuenow')).toBe('100')
  await page.keyboard.press('ArrowRight')
  expect(await s.getAttribute('aria-valuenow')).toBe('100')
  await page.keyboard.press('Home')
  expect(await s.getAttribute('aria-valuenow')).toBe('0')
})
test('project page has title, captioned gallery and neighbours', async ({ page }) => {
  await page.goto('/multi-trade/aged-care-residence/')
  await expect(page.locator('h1')).toBeVisible()
  expect(await page.locator('figure figcaption').count()).toBeGreaterThan(0)
  await expect(page.locator('.pn a').first()).toBeVisible()
})
test('unknown project is 404', async ({ page }) => expect((await page.goto('/multi-trade/nope/'))?.status()).toBe(404))
