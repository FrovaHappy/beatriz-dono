import 'module-alias/register'
import { addAliases } from 'module-alias'
import { join } from 'node:path'

addAliases({
  '@astroPages': join(process.cwd(), '../new-website/dist/server/entry.mjs')
})

