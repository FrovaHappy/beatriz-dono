import { defineConfig } from 'rollup'
import typescript from 'rollup-plugin-typescript2'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import { globSync } from 'glob'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import commonjs from '@rollup/plugin-commonjs'
export default defineConfig({
  input: Object.fromEntries(
    globSync('src/**/*.ts', {
      ignore: ['src/**/*.test.ts', 'src/**/*.d.ts']
    }).map(file => [
      // This removes `src/` as well as the file extension from each
      // file, so e.g. src/nested/foo.js becomes nested/foo
      path.relative('src', file.slice(0, file.length - path.extname(file).length)),
      // This expands the relative paths to absolute paths, so e.g.
      // src/nested/foo becomes /project/src/nested/foo.js
      fileURLToPath(new URL(file, import.meta.url))
    ])
  ),
  output: {
    format: 'es',
    dir: 'dist'
  },
  plugins: [typescript(), typescriptPaths(), commonjs()]
})
