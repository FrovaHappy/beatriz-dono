import db from './database'
export default async function getGuilds() {
  console.time('getGuilds')
  const { guildOwner } = config.env.discord

  const guildsQuery = await db.guilds.read()
  config.setting.privatesServers = [
    ...new Set(guildsQuery.map(g => (g.scope_bot === 'private' ? g.guild_id : undefined)))
  ].filter(i => i)
  config.setting.ownersServers = [
    ...new Set([...guildsQuery.map(g => (g.scope_bot === 'owner' ? g.guild_id : undefined)), guildOwner])
  ].filter(i => i)
  console.timeEnd('getGuilds')
}
