import { Client, Collection, GatewayIntentBits } from 'discord.js'
import config from './config'
import BuildCollection from './buildCollection'
import deployCommand from './deployCommands'
import BuildCommand from './shared/BuildCommand'
import BuildButton from './shared/BuildButtons'
import BuildEvent, { type Event } from './shared/BuildEvent'

export default async function startClient(): Promise<void> {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
  })

  globalThis.commands = await BuildCollection('commands', BuildCommand)
  globalThis.buttons = await BuildCollection('buttons', BuildButton)
  globalThis.cooldowns = new Collection()
  await deployCommand(globalThis.commands)

  const events = await BuildCollection<string, Event>('events', BuildEvent)

  events.forEach(event => {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args))
    } else {
      client.on(event.name, (...args) => event.execute(...args))
    }
  })
  client.login(config.discordToken)
}
