import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    passWithNoTests: true,
    projects: [
      {
        test: { name: 'unit', environment: 'node', include: ['tests/unit/**/*.test.ts'] },
      },
      await defineVitestProject({
        test: { name: 'nuxt', environment: 'nuxt', include: ['tests/nuxt/**/*.test.ts'] },
      }),
    ],
  },
})
