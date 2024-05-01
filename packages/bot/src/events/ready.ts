import { type Client, Events } from 'discord.js'
import updateBot from './ready/updateBot'

const messageReady = (user: string | undefined): string => `
▨-----------------------------------------▨
⋮  Ready! Logged in as ${user} 
▨-----------------------------------------▨
`
export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log(messageReady(client.user?.tag))
    updateBot(client)
  }
}
