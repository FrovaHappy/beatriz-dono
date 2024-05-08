import 'module-alias/register'
import { addAliases } from 'module-alias'

addAliases({
  '@': `${__dirname}`,
  '@core': `${__dirname}/core`,
  '@lib': `${__dirname}/_lib`
})
