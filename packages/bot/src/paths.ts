import 'module-alias/register'
import { join } from 'node:path'
import { addAliases } from 'module-alias'

addAliases({
  '@': join(__dirname),
  '@core': join(__dirname, 'core'),
  '@libs': join(__dirname, '../../', 'libs', 'dist')
})
