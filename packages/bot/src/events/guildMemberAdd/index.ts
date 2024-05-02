import { Events } from 'discord.js'
import welcome from './welcome'
import createServerDb from '../../shared/createServerDb'
import BuildEvent from '../../shared/BuildEvent'

export default new BuildEvent({
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member) {
    const serverId = member.guild?.id
    if (serverId) await createServerDb(serverId)
    await welcome(member)
  }
})
