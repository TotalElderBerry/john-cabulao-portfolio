import { test, expect } from '@playwright/test'

// Served on :4174 from .output-no-media/public, a build made with NUXT_PUBLIC_NO_MEDIA=1: the manifest is
// treated as empty, exactly as on a deploy where public/media is absent (see nuxt.config.ts).
const NO_MEDIA = 'http://localhost:4174'

test('pages render placeholders when media is missing', async ({ page }) => {
  for (const url of ['/', '/single-trade/', '/single-trade/plastering/1/', '/multi-trade/aged-care-residence/']) {
    const res = await page.goto(NO_MEDIA + url)
    expect(res?.status(), url).toBe(200)
    await page.waitForLoadState('load')
    expect(await page.locator('img').evaluateAll((imgs) => imgs.filter((i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth === 0).length), url).toBe(0)
    expect(await page.locator('img[src^="/media/"]').count(), url).toBe(0)
    await expect(page.locator('.media-placeholder').first(), url).toBeAttached()
  }
})
