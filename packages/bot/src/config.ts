import 'dotenv/config'
import type { BaseFileCommand } from './types/BaseFiles'
import { stringToJson } from './shared/general'

const commandKeys = 'data, execute, scope, type or name'
const validateCommand = (command: BaseFileCommand): boolean => {
  return (
    'data' in command &&
    'execute' in command &&
    'scope' in command &&
    'type' in command &&
    'name' in command &&
    'ephemeral' in command &&
    'permissions' in command
  )
}
export default {
  roleUndefined: '0',
  discordToken: process.env.DISCORD_TOKEN ?? '',
  discordClient: process.env.DISCORD_CLIENT ?? '',
  discordOwner: stringToJson<string[], string[]>(process.env.DISCORD_OWNER ?? '[]'),
  setting: process.env.SETTING,
  validateCommand,
  commandKeys
}
