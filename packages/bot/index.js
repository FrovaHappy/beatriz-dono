import tsConfigPaths from 'tsconfig-paths'
import tsConfig from './tsconfig.json'

async function run() {
  const baseUrl = './dist'
  const cleanup = tsConfigPaths.register({
    baseUrl,
    paths: tsConfig.compilerOptions.paths
  })
  cleanup()
  await import('./dist/index.js')
}

run()
