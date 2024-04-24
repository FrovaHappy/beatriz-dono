import { Events, type GuildMember } from 'discord.js'
import welcome from './guildMemberAdd/welcome'
import createServerDb from '../shared/createServerDb'

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember) {
    const serverId = member.guild?.id
    if (serverId) await createServerDb(serverId)
    await welcome(member)
  }
}
