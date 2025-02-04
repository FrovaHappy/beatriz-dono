import BuildEvent from '@core/build/BuildEvent'
import { Events } from 'discord.js'
import welcome from './welcome'

export default new BuildEvent({
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    await welcome(member)
  }
})
