// Configure Vitest (https://vitest.dev/config/)
/// <reference types="vitest" />

import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globalSetup: './src/testSetup.ts',
    testTimeout: 10_000,
    globals: true
  }
})
