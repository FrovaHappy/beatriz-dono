import db from '@/database'
import { Timer } from '@/shared/general'
export default async function syncGuilds() {
  const time = new Timer()
  const { guildOwner } = config.env.discord

  const guildsQuery = await db.guilds.read()
  const premiumGuilds = guildsQuery.filter(g => g.scope_bot === 'premium').map(g => g.guild_id)
  const developerGuilds = guildsQuery.filter(g => g.scope_bot === 'dev').map(g => g.guild_id)

  config.setting.privatesServers = premiumGuilds
  config.setting.ownersServers = [...new Set([guildOwner, ...developerGuilds])]
  return {
    guilds: guildsQuery.length,
    premium: premiumGuilds.length,
    developer: developerGuilds.length,
    time: time.final()
  }
}
