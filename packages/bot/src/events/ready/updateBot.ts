import { ActivityType, type Client } from 'discord.js'
import { version } from '../../../package.json'

export default async function updateBot(client: Client): Promise<void> {
  const time = 60 * 1000
  const fetchGuilds = async () => {
    const guilds = await client.guilds.fetch()
    const guildsCount = guilds.size
    const msgs = [
      `En ${guildsCount} servidores.`,
      `version ${version}`,
      'Colores por doquier.',
      'Votanos en top.gg',
      'Desactivamos welcome messages'
    ]
    const random = Math.floor(Math.random() * msgs.length)

    client.user?.setPresence({ activities: [{ name: msgs[random], type: ActivityType.Custom }] })
  }

  setInterval(fetchGuilds, time)
  fetchGuilds()
}
