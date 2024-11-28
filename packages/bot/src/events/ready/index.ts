import BuildEvent from '@core/build/BuildEvent'
import { Events } from 'discord.js'
import pc from 'picocolors'
import updateBot from './updateBot'
import startApi from '@/api'

const messageReady = (user: string | undefined): string => pc.bgGreen(`\n Ready! Logged in as ${pc.bold(user)} 🎉 `)
export default new BuildEvent({
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(messageReady(client.user?.tag))
    updateBot(client)
    startApi()
  }
})
