import { Client, Collection, GatewayIntentBits } from 'discord.js'
import deployCommand from './deployCommands'
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

  for (const event of Object.values(globalThis.events)) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args))
    } else {
      client.on(event.name, (...args) => event.execute(...args))
    }
  }
  client.login(config.env.discord.token)
}
