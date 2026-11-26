import { test, expect } from '@playwright/test'

test('desktop magnifier appears over the sheet', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop')
  await page.goto('/single-trade/plastering/1/')
  await page.locator('.sheet').hover({ position: { x: 200, y: 150 } })
  await expect(page.locator('.loupe')).toBeVisible()
})

test('desktop loupe follows the pointer with the mockup math', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop')
  await page.goto('/single-trade/plastering/1/')
  const sheet = page.locator('.sheet')
  await sheet.hover({ position: { x: 200, y: 150 } })
  const loupe = page.locator('.loupe')
  await expect(loupe).toHaveClass(/\bon\b/)
  const box = (await sheet.boundingBox())!
  const st = await loupe.evaluate((el) => {
    const s = (el as HTMLElement).style
    return { left: s.left, top: s.top, bp: s.backgroundPosition, bs: s.backgroundSize }
  })
  const x = parseFloat(st.left), y = parseFloat(st.top)
  // Pointer at (200,150) of the sheet, give or take subpixel layout.
  expect(Math.abs(x - 200)).toBeLessThan(1.5)
  expect(Math.abs(y - 150)).toBeLessThan(1.5)
  const [bx, by] = st.bp.split(' ').map(parseFloat)
  expect(bx).toBeCloseTo(-(x * 3 - 115), 1)
  expect(by).toBeCloseTo(-(y * 3 - 115), 1)
  const [w] = st.bs.split(' ').map(parseFloat)
  expect(Math.abs(w! - box.width * 3)).toBeLessThan(3)
  expect(await loupe.evaluate((el) => (el as HTMLElement).style.backgroundImage)).toContain('p1-3200')
})

test('touch: tap opens enlarged view', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile')
  await page.goto('/single-trade/plastering/1/')
  await page.locator('.sheet').tap()
  await expect(page.getByRole('dialog', { name: /sheet/i })).toBeVisible()
})

test('touch: no loupe; close button closes the dialog', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile')
  await page.goto('/single-trade/plastering/1/')
  await page.locator('.sheet').tap()
  const dlg = page.getByRole('dialog', { name: /sheet/i })
  await expect(dlg.locator('img')).toHaveAttribute('src', /p1-3200\.(jpg|webp)/)
  await expect(page.locator('.loupe')).toHaveCount(0)
  await dlg.getByRole('button', { name: /close/i }).tap()
  await expect(dlg).toHaveCount(0)
})

test('keyboard: Enter opens the enlarged sheet; Esc closes and returns focus', async ({ page }) => {
  await page.goto('/single-trade/plastering/1/')
  const sheet = page.locator('.sheet')
  await sheet.focus()
  await page.keyboard.press('Enter')
  const dlg = page.getByRole('dialog', { name: /sheet/i })
  await expect(dlg).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dlg).toHaveCount(0)
  await expect(sheet).toBeFocused()
})

test('legend and meta render; no BOQ download by default', async ({ page }) => {
  await page.goto('/single-trade/plastering/1/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Plastering — Job 01')
  await expect(page.locator('.legend')).toContainText('101.5 m')
  await expect(page.getByRole('link', { name: /BOQ \(PDF\)/ })).toHaveCount(0)
  const meta = page.locator('.meta')
  await expect(meta).toContainText('Office fit-out')
  await expect(meta).toContainText('Measured in')
  await expect(meta).toContainText('PlanSwift')
  await expect(meta).toContainText('Markups + BOQ')
  await expect(page.locator('body')).not.toContainText('undefined')
  await expect(page).toHaveTitle('Plastering — Job 01 · Cabulao')
})

test('prev/next skip missing jobs', async ({ page }) => {
  await page.goto('/single-trade/carpentry/6/')
  await expect(page.getByRole('link', { name: /next/i })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /prev.*Job 05/i })).toHaveAttribute('href', '/single-trade/carpentry/5/')
})

test('first job has next but no prev', async ({ page }) => {
  await page.goto('/single-trade/plastering/1/')
  await expect(page.getByRole('link', { name: /prev/i })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /next.*Job 02/i })).toHaveAttribute('href', '/single-trade/plastering/2/')
})

test('no horizontal scroll on the job page', async ({ page }) => {
  await page.goto('/single-trade/plastering/1/')
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(over).toBeLessThanOrEqual(0)
})

test('flagship: BOQ line zooms the drawing and does not open the viewer dialog', async ({ page }) => {
  await page.goto('/single-trade/plastering/1/')
  await expect(page.getByRole('heading', { name: 'From drawing to line item.' })).toBeVisible()
  const line = page.locator('button.line').first()
  await line.click()
  await expect(line).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('[data-stage]')).toHaveAttribute('style', /scale\(/)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('button', { name: 'Whole sheet' }).click()
  await expect(line).toHaveAttribute('aria-pressed', 'false')
})

test('non-flagship job has no BOQ link', async ({ page }) => {
  await page.goto('/single-trade/plastering/2/')
  await expect(page.getByRole('heading', { name: 'From drawing to line item.' })).toHaveCount(0)
})
