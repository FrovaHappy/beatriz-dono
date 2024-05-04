import { Client, Collection, GatewayIntentBits } from 'discord.js'
import config from './config'
import BuildCollection from './build/buildCollection'
import deployCommand from './deployCommands'
import BuildCommand from './build/BuildCommand'
import BuildButton from './build/BuildButtons'
import BuildEvent, { type Event } from './build/BuildEvent'
import BuildMenu from './build/BuildMenu'

export default async function startClient(): Promise<void> {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
  })

  globalThis.commands = await BuildCollection('commands', BuildCommand)
  globalThis.buttons = await BuildCollection('buttons', BuildButton)
  globalThis.menus = await BuildCollection('menus', BuildMenu)
  globalThis.cooldowns = new Collection()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
