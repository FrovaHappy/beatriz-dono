import './config'
import moduleAlias from 'module-alias'
import { exit } from 'node:process'
import startClient from './core/client'
import getGuilds from './getGuilds'
import { syncCli } from './database/clientSQL'
import path from 'node:path'

const run = async () => {
  console.log(path.join(process.cwd(), '../libs/dist'))
  moduleAlias.addAliases({
    '@libs': path.join(process.cwd(), '../libs/dist')
  })
  await syncCli()
  await getGuilds()
  await startClient()
}
run().catch(error => {
  console.error(error)
  exit(1)
})
