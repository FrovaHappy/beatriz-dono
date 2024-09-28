import 'dotenv/config'
import type { Setting } from '@prisma/client'

const settingDb: Omit<Setting, 'id'> = {
  cooldown: Number.parseInt(process.env.COOLDOWNS_DEFAULT ?? '5'),
  privatesServers: JSON.parse(process.env.PRIVATES_SERVERS ?? '[]') ?? [],
  ownersServers: JSON.parse(process.env.OWNERS_SERVERS ?? '[]') ?? [],
  linkDiscord: process.env.DISCORD_INVITE_URL ?? 'https://discord.gg/JRpHsGC8YQ',
  linkGithub: process.env.GITHUB_LINK ?? 'https://github.com/FrovaHappy/beatriz-dono',
  linkDocumentation: process.env.DOCUMENTATION_LINK ?? 'https://frovahappy.gitbook.io/beatriz-bot-docs/',
  linkWebsite: process.env.WEBSITE_LINK ?? 'https://beatriz-dono.vercel.app/',
  linkKofi: process.env.KOFI_LINK ?? 'https://ko-fi.com/frovahappy',
  linkTopgg: process.env.TOPGG_LINK ?? 'https://top.gg/bot/971562890702237766',
  linkBotList: process.env.BOTLIST_LINK ?? 'https://discordbotlist.com/bots/beatrizdono-beta'
}
const env = {
  discordToken: process.env.DISCORD_TOKEN ?? '',
  discordClient: process.env.DISCORD_CLIENT ?? ''
}
const utils = {
  imageTransparent: 'https://i.imgur.com/m8BHGOt.png',
  imageAvatar: 'https://i.imgur.com/LB7cfKh.png'
}

const config = { ...settingDb, ...env, ...utils }
export type Config = typeof config
globalThis.config = config
