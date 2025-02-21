import './paths'
import './config'
import startClient from './core/client'
import getGuilds from './getGuilds'
import { exit } from 'node:process'
import { loadTables } from './database/clientSQL'

const run = async () => {
  await loadTables()
  await getGuilds()
  await startClient()
}
run().catch(error => {
  console.error(error)
  exit(1)
})
