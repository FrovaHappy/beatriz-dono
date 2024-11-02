import 'dotenv/config'
import type { Setting } from '@prisma/client'
import { z } from 'zod'
import p from 'picocolors'

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

const utils = {
  imageTransparent: 'https://i.imgur.com/m8BHGOt.png',
  imageAvatar: 'https://i.imgur.com/LB7cfKh.png'
}
export const envSchema = z.object({
  DISCORD_TOKEN: z.string(),
  DISCORD_CLIENT: z.string(),
  DISCORD_OWNER: z.string(),
  DATABASE_URL: z.string()
})
const env = {
  discordToken: process.env.DISCORD_TOKEN!,
  discordClient: process.env.DISCORD_CLIENT!,
  discordOwner: process.env.DISCORD_OWNER!,
  rootPath: process.env.NODE_ENV === 'production' ? `${process.cwd()}/dist` : `${process.cwd()}/src`
}

try {
  envSchema.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError) {
    let message = `${p.bgRedBright(' Error ')} Invalid environment variables:\n\n`
    for (const issue of error.issues) {
      message += `${p.gray('┃')} ${issue.path.join('→')} ${p.gray(`(${issue.message})`)}\n`
    }
    console.log(message)
    process.exit(1)
  }
}

const config = { ...settingDb, ...env, ...utils }
export type Config = typeof config
globalThis.config = config
