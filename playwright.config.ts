import { defineConfig, devices } from '@playwright/test'

// Two static servers: the normal build on :4173 and the no-media build (NUXT_PUBLIC_NO_MEDIA=1) on :4174
// for tests/e2e/no-media.spec.ts. Both builds run first unless SKIP_GENERATE=1 (`npm run check` builds them
// once up front). The :4174 server answers 404 until its build exists, so Playwright waits for it.
const build = process.env.SKIP_GENERATE ? '' : 'npm run generate && npm run generate:no-media && '

export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:4173' },
  webServer: [
    {
      command: `${build}npm run preview`,
      url: 'http://localhost:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 480_000,
    },
    {
      command: 'node scripts/preview.mjs',
      env: { PORT: '4174', PREVIEW_ROOT: '.output-no-media/public' },
      url: 'http://localhost:4174',
      reuseExistingServer: !process.env.CI,
      timeout: 480_000,
    },
  ],
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], browserName: 'chromium' } },
    { name: 'narrow', use: { browserName: 'chromium', viewport: { width: 360, height: 740 } } },
  ],
})
