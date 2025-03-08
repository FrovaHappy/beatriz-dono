import startApi from '@/api'
import BuildEvent from '@core/build/BuildEvent'
import { Events } from 'discord.js'
import pc from 'picocolors'
import updateBot from './updateBot'

export default new BuildEvent({
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`\n${pc.bgGreen(' Bot ')} Bot started as ${pc.cyan(client.user?.username)}`)
    updateBot(client)
    startApi()
  }
})
