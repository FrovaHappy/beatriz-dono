// Configure Vitest (https://vitest.dev/config/)
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    testTimeout: 10_000
  }
})
