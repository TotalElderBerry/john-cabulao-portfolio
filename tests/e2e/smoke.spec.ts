import { test, expect } from '@playwright/test'

test('layout renders nav and footer', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Cabulao.', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: /send drawings/i })).toHaveAttribute('href', '/contact/')
  await expect(page.locator('footer')).toContainText('PlanSwift')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  expect(overflow).toBe(false)
})
