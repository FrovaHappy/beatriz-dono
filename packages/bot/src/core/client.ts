import { Client, Collection, GatewayIntentBits } from 'discord.js'
import deployCommand from './deployCommands'
import getEvents from './getEvents'
import getServices from './getServices'
import loadFonts from './loadFonts'

export default async function startClient() {
  const { config } = globalThis
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
  })
  globalThis.cooldowns = new Collection()

  await loadFonts()
  await getServices()
  await deployCommand(globalThis.commands)

  const events = await getEvents()

  for (const event of events.values()) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args))
    } else {
      client.on(event.name, (...args) => event.execute(...args))
    }
  }
  client.login(config.env.discord.token)
}
