// Configure Vitest (https://vitest.dev/config/)
/// <reference types="vitest" />

import { resolve } from 'node:path'
import { compilerOptions } from './tsconfig.json'

const alias = Object.entries(compilerOptions.paths).reduce((acc, [key, [value]]) => {
  const aliasKey = key.substring(0, key.length - 2)
  const path = value.substring(0, value.length - 2)
  return {
    ...acc,
    [aliasKey]: resolve(__dirname, path)
  }
}, {})

import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias
  },
  test: {
    globals: true
  }
})
