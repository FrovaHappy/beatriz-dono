import 'dotenv/config'
import { type Setting } from '@prisma/client'

const settingDb: Omit<Setting, 'id'> = {
  cooldown: parseInt(process.env.COOLDOWNS_DEFAULT ?? '5'),
  privatesServers: [],
  ownersServers: [],
  discordInviteUrl: ''
}
const env = {
  discordToken: process.env.DISCORD_TOKEN ?? '',
  discordClient: process.env.DISCORD_CLIENT ?? ''
}

const config = { ...settingDb, ...env }
export type Config = typeof config
globalThis.config = config
