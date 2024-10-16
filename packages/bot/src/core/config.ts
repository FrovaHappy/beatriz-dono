import 'dotenv/config'
import type { Setting } from '@prisma/client'

const settingDb = {
  cooldown: 5, // 5 segundos
  privatesServers: [],
  ownersServers: [],
  linkDiscord: 'https://discord.gg/JRpHsGC8YQ',
  linkGithub: 'https://github.com/FrovaHappy/beatriz-dono',
  linkDocumentation: 'https://frovahappy.gitbook.io/beatriz-bot-docs/',
  linkWebsite: 'https://beatriz-dono.vercel.app/',
  linkKofi: 'https://ko-fi.com/frovahappy',
  linkTopgg: 'https://top.gg/bot/971562890702237766',
  linkBotList: 'https://discordbotlist.com/bots/beatrizdono-beta'
} as Omit<Setting, 'id'>
const env = {
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  discordToken: process.env.DISCORD_TOKEN!,
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  discordClient: process.env.DISCORD_CLIENT!,
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  discordOwner: process.env.DISCORD_OWNER!,
  rootPath: process.env.NODE_ENV === 'production' ? `${process.cwd()}/dist` : `${process.cwd()}/src`
}
const utils = {
  imageTransparent: 'https://i.imgur.com/m8BHGOt.png',
  imageAvatar: 'https://i.imgur.com/LB7cfKh.png'
}

const config = { ...settingDb, ...env, ...utils }
export type Config = typeof config
globalThis.config = config
