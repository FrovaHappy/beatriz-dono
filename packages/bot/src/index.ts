import './config'
import { exit } from 'node:process'
import startClient from '@/core/client'
import syncGuilds from '@/database/syncGuilds'
import { syncCli } from '@/database/clientSQL'
import logger from './shared/logger'

const run = async () => {
  try {
    const resultCli = await syncCli()
    const resultGuilds = await syncGuilds()
    logger({
      type: 'info',
      head: 'Database',
      title: 'Syncing',
      body: `
        Synced database in ${resultCli}
        Guilds synced in ${resultGuilds.time}  
        ┃ guilds: ${resultGuilds.guilds}  
        ┃ premium: ${resultGuilds.premium}  
        ┃ developer: ${resultGuilds.developer}  
      `
    })
  } catch (error) {
    logger({
      type: 'error',
      head: 'Database',
      title: 'Syncing',
      body: `${error}`
    })
    exit(1)
  }
  await startClient()
}
run().catch(error => {
  logger({
    type: 'error',
    head: 'Bot',
    title: 'uncaughtException',
    body: `${error}`
  })
  exit(1)
})
