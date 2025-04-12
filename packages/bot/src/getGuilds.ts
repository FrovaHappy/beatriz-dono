import db from './database'
export default async function getGuilds() {
  console.time('getGuilds')
  const { guildOwner } = config.env.discord

  const guildsQuery = (await db.guilds.read()) ?? []
  const premiumGuilds = guildsQuery.filter(g => g.scope_bot === 'premium').map(g => g.guild_id)
  const developerGuilds = guildsQuery.filter(g => g.scope_bot === 'developer').map(g => g.guild_id)

  config.setting.privatesServers = premiumGuilds
  config.setting.ownersServers = [...new Set([guildOwner, ...developerGuilds])]
  console.timeEnd('getGuilds')
}
