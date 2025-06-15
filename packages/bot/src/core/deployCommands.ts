import type { Scope } from '@/types/main'
import { type RESTPostAPIChatInputApplicationCommandsJSONBody as CommandDataJson, REST, Routes } from 'discord.js'
import type { Command } from './build/BuildCommand'
import logger from '@/shared/logger'
import { Timer } from '@/shared/general'

export const rest = new REST().setToken(config.env.discord.token)

export async function putGuildCommands(guildsIds: string[], commands: CommandDataJson[], scope: Scope) {
  const time = new Timer()
  const errors: string[] = []
  for await (const guildId of guildsIds) {
    try {
      await rest.put(Routes.applicationGuildCommands(config.env.discord.applicationId, guildId), {
        body: commands
      })
    } catch (error: any) {
      errors.push(guildId)
    }
  }
  return {
    success: errors.length === 0,
    count: commands.length,
    errors,
    time: time.final()
  }
}

export async function putGlobalCommands(commands: CommandDataJson[]) {
  const time = new Timer()
  try {
    await rest.put(Routes.applicationCommands(config.env.discord.applicationId), {
      body: commands
    })
    return {
      success: true,
      count: commands.length,
      errors: [],
      time: time.final()
    }
  } catch (error: any) {
    return {
      success: false,
      count: commands.length,
      errors: [error.message],
      time: time.final()
    }
  }
}

function getCommands(collection: Record<string, Command>) {
  const commands: Record<Scope, CommandDataJson[]> = {
    free: [],
    premium: [],
    dev: []
  }
  for (const command of Object.values(collection)) {
    commands[command.scope] = [command.data.toJSON(), ...(commands[command.scope] ?? [])]
  }
  return commands
}

export default async function deployCommand(collection: Record<string, Command>): Promise<void> {
  const time = new Timer()
  const commands = getCommands(collection)
  const excludeOwnerOfPrivates = config.setting.privatesServers.filter(
    guildId => !config.setting.ownersServers.includes(guildId)
  )

  const results = {
    global: await putGlobalCommands(commands.free),
    dev: await putGuildCommands(config.setting.ownersServers, [...commands.premium, ...commands.dev], 'dev'),
    premium: await putGuildCommands(excludeOwnerOfPrivates, commands.premium, 'premium')
  }
  const messageErrors = {
    global: results.global.success ? '✅ Success' : `❌ Failed: ${results.global.errors.join(', ')}`,
    dev: results.dev.success ? '✅ Success' : `❌ Failed: ${results.dev.errors.join(', ')}`,
    premium: results.premium.success ? '✅ Success' : `❌ Failed: ${results.premium.errors.join(', ')}`
  }
  logger({
    type: 'info',
    head: 'Deploy Commands',
    title: 'Deployment Results',
    body: `
      Global Commands
      ├─ Status: ${messageErrors.global}
      ├─ Deployed: ${results.global.count}
      └─ Time: ${results.global.time}ms

      Dev Commands
      ├─ Status: ${messageErrors.dev}
      ├─ Deployed: ${results.dev.count}
      └─ Time: ${results.dev.time}

      Premium Commands
      ├─ Status: ${messageErrors.premium}
      ├─ Deployed: ${results.premium.count}
      └─ Time: ${results.premium.time}

      Global Time: ${time.final()}
    `
  })
}
