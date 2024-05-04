import { Events } from 'discord.js'
import updateBot from './updateBot'
import BuildEvent from '@core/build/BuildEvent'

const messageReady = (user: string | undefined): string => `
▨-----------------------------------------▨
⋮  Ready! Logged in as ${user} 
▨-----------------------------------------▨
`
export default new BuildEvent({
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(messageReady(client.user?.tag))
    updateBot(client)
  }
})
