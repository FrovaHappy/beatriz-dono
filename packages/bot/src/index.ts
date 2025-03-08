import './paths'
import './config'
import { exit } from 'node:process'
import startClient from './core/client'
import { loadTables } from './database/clientSQL'
import getGuilds from './getGuilds'

const run = async () => {
  await loadTables()
  await getGuilds()
  await startClient()
}
run().catch(error => {
  console.error(error)
  exit(1)
})
