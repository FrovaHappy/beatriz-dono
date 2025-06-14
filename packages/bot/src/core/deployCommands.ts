import type { Scope } from '@/types/main'
import { type RESTPostAPIChatInputApplicationCommandsJSONBody as CommandDataJson, REST, Routes } from 'discord.js'
import type { Command } from './build/BuildCommand'
import logger, { decoreLog } from '@/shared/logger'
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
  if (errors.length === 0) {
    logger({
      type: 'info',
      head: 'Deploy Commands',
      title: `Deploying ${decoreLog.info(scope)} commands`,
      body: `deployed without errors.\n received: ${commands.length}\n finished in ${time.final()}`
    })
    return
  }
  logger({
    type: 'error',
    head: 'Deploy Commands',
    title: `Deploying ${decoreLog.info(scope)} commands`,
    body: `deployed with errors.\n received: ${commands.length}\n errors: ${errors.join(', ')} \n finished in ${time.final()}`
  })
}

export async function putGlobalCommands(commands: CommandDataJson[]) {
  const time = new Timer()
  try {
    await rest.put(Routes.applicationCommands(config.env.discord.applicationId), {
      body: commands
    })
  } catch (error: any) {
    logger({
      type: 'error',
      head: 'Deploy Commands',
      title: `Deploying ${decoreLog.info('global')} commands`,
      body: `deployed with errors.\n received: ${commands.length}\n errors: ${error.message}\n finished in ${time.final()}`
    })
    return
  }
  logger({
    type: 'info',
    head: 'Deploy Commands',
    title: `Deploying ${decoreLog.info('global')} commands`,
    body: `deployed without errors.\n received: ${commands.length}\n finished in ${time.final()}`
  })
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
  const commands = getCommands(collection)
  const excludeOwnerOfPrivates = config.setting.privatesServers.filter(
    guildId => !config.setting.ownersServers.includes(guildId)
  )
  logger({
    type: 'info',
    head: 'Deploy Commands',
    title: 'Deploying commands ...',
    body: `
      public commands found: ${commands.free.length}  
      owner commands found: ${commands.dev.length}  
      private commands found: ${commands.premium.length}  
      privates servers found: ${config.setting.privatesServers.length}  
      owners servers found: ${config.setting.ownersServers.length}  
      exclude owners servers of private: ${config.setting.privatesServers.length - excludeOwnerOfPrivates.length}
    `
  })

  await putGlobalCommands(commands.free) // update public commands
  await putGuildCommands(config.setting.ownersServers, [...commands.premium, ...commands.dev], 'dev') // update owner commands
  await putGuildCommands(excludeOwnerOfPrivates, commands.premium, 'premium') // update private commands
}
