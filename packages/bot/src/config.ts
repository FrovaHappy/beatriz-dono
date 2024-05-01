import 'dotenv/config'
import { stringToJson } from './shared/general'

export default {
  roleUndefined: '0',
  discordToken: process.env.DISCORD_TOKEN ?? '',
  discordClient: process.env.DISCORD_CLIENT ?? '',
  discordOwner: stringToJson<string[], string[]>(process.env.DISCORD_OWNER ?? '[]'),
  setting: process.env.SETTING
}
