import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'es'
  },
  external: ['discord.js', '@napi-rs/canvas', '@libs/*'],

  plugins: [typescript(), typescriptPaths(), json(), commonjs()]
})
