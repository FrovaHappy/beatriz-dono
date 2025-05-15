import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import commonjs from '@rollup/plugin-commonjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'es',
    sourcemap: true
  },
  external: ['discord.js', '@napi-rs/canvas'],

  plugins: [typescript({ exclude: ['**/*.test.ts', '**/*.d.ts'] }), json(), commonjs()]
})
