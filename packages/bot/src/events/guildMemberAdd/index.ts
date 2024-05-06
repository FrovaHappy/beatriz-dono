import { Events } from 'discord.js'
import welcome from './welcome'
import createServerDb from '@core/shared/createServerDb'
import BuildEvent from '@core/build/BuildEvent'

export default new BuildEvent({
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    const serverId = member.guild?.id
    if (serverId) await createServerDb(serverId)
    await welcome(member)
  }
})
