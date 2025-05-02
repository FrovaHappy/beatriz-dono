import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'es'
  },

  plugins: [typescript(), typescriptPaths(), json(), nodeResolve()]
})
