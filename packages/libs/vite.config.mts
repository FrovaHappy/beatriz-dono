// Configure Vitest (https://vitest.dev/config/)
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    testTimeout: 10_000,
    environment: 'node', // Default environment
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.config.*',
        'vite.config.mts',
        'rollup.config.mjs'
      ]
    }
  }
})
