import { addAliases } from 'module-alias'

addAliases({
  '@libs': '../libs/dist'
})
;(async () => {
  await import('./dist/index.js')
})()
