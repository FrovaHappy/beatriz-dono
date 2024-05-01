import fs from 'node:fs'
import path from 'node:path'
import { Client, Collection, GatewayIntentBits } from 'discord.js'
import config from './config'
import BuildCollection from './buildCollection'
import deployCommand from './deployCommands'
import BuildCommand from './shared/BuildCommand'
import BuildButton from './shared/BuildButtons'

export default async function startClient(): Promise<void> {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
  })

  globalThis.commands = await BuildCollection('commands', BuildCommand)
  globalThis.buttons = await BuildCollection('buttons', BuildButton)
  globalThis.cooldowns = new Collection()
  await deployCommand(globalThis.commands)

  const eventsPath = path.join(__dirname, 'events')
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'))

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file)
    const event = require(filePath).default
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args))
    } else {
      client.on(event.name, (...args) => event.execute(...args))
    }
  }

  client.login(config.discordToken)
}
