import db from './database'
import { Timer } from './shared/general'
import logger from './shared/logger'
export default async function getGuilds() {
  const time = new Timer()
  const { guildOwner } = config.env.discord

  const guildsQuery = await db.guilds.read()
  const premiumGuilds = guildsQuery.filter(g => g.scope_bot === 'premium').map(g => g.guild_id)
  const developerGuilds = guildsQuery.filter(g => g.scope_bot === 'dev').map(g => g.guild_id)

  config.setting.privatesServers = premiumGuilds
  config.setting.ownersServers = [...new Set([guildOwner, ...developerGuilds])]
  logger({
    type: 'info',
    head: 'Guilds',
    title: 'Getting guilds',
    body: `
      premium guilds found: ${premiumGuilds.length}  
      developer guilds found: ${developerGuilds.length}  
      owners servers found: ${config.setting.ownersServers.length}  
      privates servers found: ${config.setting.privatesServers.length}  
      finished in ${time.final()}
    `
  })
}
