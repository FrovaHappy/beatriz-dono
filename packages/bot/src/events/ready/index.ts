import BuildEvent from '@core/build/BuildEvent'
import { Events } from 'discord.js'
import pc from 'picocolors'
import updateBot from './updateBot'
import startApi from '@/api'

export default new BuildEvent({
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`\n${pc.bgGreen(' Bot ')} Bot started as ${pc.cyan(client.user?.username)}`)
    updateBot(client)
    startApi()
  }
})
