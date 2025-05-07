import tsConfig from './tsconfig.json'
import tsConfigPaths from 'tsconfig-paths'
;(async () => {
  const baseUrl = './dist'
  const cleanup = tsConfigPaths.register({
    baseUrl,
    paths: tsConfig.compilerOptions.paths
  })
  cleanup()
  await import('./dist/index.js')
})()
