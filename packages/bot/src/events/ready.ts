import type { ClientCustom } from '../types/main'

import { Events } from 'discord.js'
import updateBot from './ready/updateBot'

const messageReady = (user: string | undefined): string => `
▨-----------------------------------------▨
⋮  Ready! Logged in as ${user} 
▨-----------------------------------------▨
`
export default {
  name: Events.ClientReady,
  once: true,
  execute(client: ClientCustom) {
    console.log(messageReady(client.user?.tag))
    updateBot(client)
  }
}
