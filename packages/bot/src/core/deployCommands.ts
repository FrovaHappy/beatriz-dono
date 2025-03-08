import type { Scope } from '@/types/main'
import {
  type Collection,
  type RESTPostAPIChatInputApplicationCommandsJSONBody as CommandDataJson,
  REST,
  Routes
} from 'discord.js'
import pc from 'picocolors'
import type { Command } from './build/BuildCommand'

export const rest = new REST().setToken(config.env.discord.token)

export async function putGuildCommands(guildsIds: string[], commands: CommandDataJson[], scope: Scope) {
  const errors: string[] = []
  console.log(`  ∷ deploying ${pc.bold(scope)} commands ...`)
  for await (const guildId of guildsIds) {
    try {
      await rest.put(Routes.applicationGuildCommands(config.env.discord.applicationId, guildId), {
        body: commands
      })
    } catch (error: any) {
      errors.push(guildId)
    }
  }
  console.log(`  ∷ done deploying ${pc.bold(scope)} commands with ${pc.bold(errors.length)} errors`)
}

export async function putGlobalCommands(commands: CommandDataJson[]) {
  console.log('  ∷ deploying global commands ...')
  try {
    await rest.put(Routes.applicationCommands(config.env.discord.applicationId), {
      body: commands
    })
  } catch (error: any) {
    console.log(`  ∷ error deploying global commands: ${pc.bold(error.message)}`)
    return
  }
  console.log('  ∷ done deploying global commands')
}

function getCommands(collection: Collection<string, Command>) {
  const commands: Record<Scope, CommandDataJson[]> = {
    owner: [],
    private: [],
    public: []
  }
  for (const command of collection.values()) {
    commands[command.scope] = [command.data.toJSON(), ...(commands[command.scope] ?? [])]
  }
  return commands
}

export default async function deployCommand(collection: Collection<string, Command>): Promise<void> {
  const commands = getCommands(collection)
  const excludeOwnerOfPrivates = config.setting.privatesServers.filter(
    guildId => !config.setting.ownersServers.includes(guildId)
  )
  const logsCommands = [
    `${pc.green('[commands]:')} Deploying commands ...`,
    `   - public commands found: ${pc.bold(commands.public.length)}`,
    `   - owner commands found: ${pc.bold(commands.owner.length)}`,
    `   - private commands found: ${pc.bold(commands.private.length)}`,
    `   - privates servers found: ${pc.bold(config.setting.privatesServers.length)}`,
    `   - owners servers found: ${pc.bold(config.setting.ownersServers.length)}`,
    `   - exclude owners servers of private: ${pc.bold(config.setting.privatesServers.length - excludeOwnerOfPrivates.length)}`
  ]
  console.log(logsCommands.join('\n'))

  await putGlobalCommands(commands.public) // update public commands
  await putGuildCommands(config.setting.ownersServers, [...commands.private, ...commands.owner], 'owner') // update owner commands
  await putGuildCommands(excludeOwnerOfPrivates, commands.private, 'private') // update private commands

  console.log()
}
