import 'dotenv/config'
import type { Setting } from '@prisma/client'

const settingDb: Omit<Setting, 'id'> = {
  cooldown: Number.parseInt(process.env.COOLDOWNS_DEFAULT ?? '5'),
  privatesServers: JSON.parse(process.env.PRIVATES_SERVERS ?? '[]') ?? [],
  ownersServers: JSON.parse(process.env.OWNERS_SERVERS ?? '[]') ?? [],
  discordInviteUrl: process.env.DISCORD_INVITE_URL ?? 'https://discord.gg/'
}
const env = {
  discordToken: process.env.DISCORD_TOKEN ?? '',
  discordClient: process.env.DISCORD_CLIENT ?? ''
}

const config = { ...settingDb, ...env }
export type Config = typeof config
globalThis.config = config
