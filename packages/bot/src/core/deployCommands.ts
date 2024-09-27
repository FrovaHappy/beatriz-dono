import type { Scope } from '@/types/main'
import {
  type Collection,
  type RESTPostAPIChatInputApplicationCommandsJSONBody as CommandDataJson,
  REST,
  Routes
} from 'discord.js'
import pc from 'picocolors'
import type { Command } from './build/BuildCommand'

export const rest = new REST().setToken(config.discordToken)

export async function putGuildCommands(guildsIds: string[], commands: CommandDataJson[], scope: Scope) {
  const errors: string[] = []
  for await (const guildId of guildsIds) {
    try {
      await rest.put(Routes.applicationGuildCommands(config.discordClient, guildId), {
        body: commands
      })
    } catch (error: any) {
      errors.push(guildId)
    }
  }
  console.log(
    `· ${pc.bgBlue(scope)} commands done ${guildsIds.length} with ${errors.length} errors: [${errors.join(', ')}].`
  )
}

export async function putGlobalCommands(commands: CommandDataJson[]) {
  try {
    await rest.put(Routes.applicationCommands(config.discordClient), {
      body: commands
    })
  } catch (error: any) {
    console.log(`· ${pc.bgBlue('public')} commands Fails: ${error.message}`)
    return
  }
  console.log(`· ${pc.bgBlue('public')} commands Done `)
}

function getCommands(collection: Collection<string, Command>) {
  const commands: Record<Scope, CommandDataJson[]> = {
    owner: [],
    private: [],
    public: []
  }
  collection.forEach(command => {
    commands[command.scope] = [command.data.toJSON(), ...(commands[command.scope] ?? [])]
  })
  return commands
}

export default async function deployCommand(collection: Collection<string, Command>): Promise<void> {
  console.log('deployCommand start')
  const commands = getCommands(collection)
  await putGlobalCommands(commands.public) // update public commands
  await putGuildCommands(config.ownersServers, commands.owner, 'owner') // update owner commands
  await putGuildCommands(config.privatesServers, commands.private, 'private') // update private commands
}
