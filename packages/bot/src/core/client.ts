import { Client, Collection, GatewayIntentBits } from 'discord.js'
import BuildCollection from './build/buildCollection'
import deployCommand from './deployCommands'
import BuildCommand from './build/BuildCommand'
import BuildButton from './build/BuildButtons'
import BuildEvent, { type Event } from './build/BuildEvent'
import BuildMenu from './build/BuildMenu'
import BuildModal from './build/BuildModal'

export default async function startClient(): Promise<void> {
  const { config } = globalThis
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
  })

  globalThis.commands = await BuildCollection({
    srcFolder: 'services',
    subFolders: 'commands',
    Constructor: BuildCommand
  })
  globalThis.buttons = await BuildCollection({ srcFolder: 'services', subFolders: 'buttons', Constructor: BuildButton })
  globalThis.menus = await BuildCollection({ srcFolder: 'services', subFolders: 'menus', Constructor: BuildMenu })
  globalThis.modals = await BuildCollection({ srcFolder: 'services', subFolders: 'modals', Constructor: BuildModal })
  globalThis.cooldowns = new Collection()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await deployCommand(globalThis.commands)

  const events = await BuildCollection<string, Event>({ srcFolder: 'events', Constructor: BuildEvent })

  events.forEach(event => {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args))
    } else {
      client.on(event.name, (...args) => event.execute(...args))
    }
  })
  client.login(config.discordToken)
}
