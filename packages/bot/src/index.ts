import './paths'
import './config'
import { exit } from 'node:process'
import startClient from './core/client'
import getGuilds from './getGuilds'
import { syncCli } from './database/clientSQL'

const run = async () => {
  await syncCli()
  await getGuilds()
  await startClient()
}
run().catch(error => {
  console.error(error)
  exit(1)
})
