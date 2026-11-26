import { test, expect } from '@playwright/test'

test('hero shows both doorways with computed counts', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Measured.' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(page.getByRole('link', { name: /Multi-trade\s*03/ })).toHaveAttribute('href', '/multi-trade/')
  await expect(page.getByRole('link', { name: /Single-trade\s*39/ })).toHaveAttribute('href', '/single-trade/')
})

test('hero intro links to about and lists the main tools', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: /learn about me/i })).toHaveAttribute('href', '/about/')
  await expect(page.locator('.hero .tools')).toContainText('PlanSwift')
})

test('scan quantities reach legend values at the end of the section', async ({ page }) => {
  await page.goto('/')
  await page.locator('#scan').evaluate((el: HTMLElement) => scrollTo(0, el.offsetTop + el.offsetHeight))
  await expect(page.locator('#scan')).toContainText('101.5')
})

test('reduced motion shows final state without scrolling', async ({ browser }) => {
  const page = await browser.newPage({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('#scan')).toContainText('101.5')
  await expect(page.locator('.statement span.on')).toHaveCount(await page.locator('.statement span').count())
  await page.close()
})

test('reduced motion stacks the gallery so the last panel and All projects are visible', async ({ browser }) => {
  const page = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1280, height: 800 } })
  await page.goto('/')
  const panels = page.locator('#multi .panel')
  await panels.last().scrollIntoViewIfNeeded()
  await expect(panels.nth(await panels.count() - 2)).toBeVisible()
  const link = page.getByRole('link', { name: /All projects/ })
  await link.scrollIntoViewIfNeeded()
  await expect(link).toBeInViewport()
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
  await page.close()
})

test('statement text and gallery end link are in the prerendered HTML', async ({ request }) => {
  const html = await (await request.get('/')).text()
  expect(html).toContain('>square</span>')
  expect(html).toMatch(/href="\/multi-trade\/"[^>]*>\s*All projects/)
})

test('scan quantities are scroll-driven: they start below the legend values at the top of the page', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#scan')).not.toContainText('101.5')
  await expect(page.locator('#scan .q b').first()).toHaveText(/^0\.0\s*m$/)
})
