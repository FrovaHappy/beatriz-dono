import 'dotenv/config'
import type { Setting } from '@prisma/client'
import { any, string, z } from 'zod'
import p from 'picocolors'
;(() => {
  const envSchema = z.object({
    DATABASE_URL: z.string(),
    PRIVATE: z.string(),
    PORT: z.string().optional()
  })
  try {
    envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      let message = `${p.bgRedBright(' Error ')} Invalid environment variables:\n\n`
      for (const issue of error.issues) {
        message += `${p.gray('┃')} ${issue.path.join(' → ')} ${p.gray(`(${issue.message})`)}\n`
      }
      console.log(message)
    }
    process.exit(1)
  }
})()

const parsePrivate = (s: string) => {
  const privateSchema = z
    .object({
      discord: z.object({
        token: z.string(),
        applicationId: z.string(),
        oAuthSecret: z.string(),
        oAuthCallback: z.string(),
        guildOwner: z.string(),
        userOwner: z.string(),
        cooldown: z.number().default(5)
      }),
      api: z
        .object({
          secretKey: z.string(),
          urlClientDomain: z.string()
        })
        .strict()
    })
    .strict()
  type Private = z.infer<typeof privateSchema>
  try {
    return privateSchema.parse(JSON.parse(s)) as Private
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      let message = `${p.bgRedBright(' Error ')}  Invalid env.PRIVATE config:\n\n`
      for (const issue of error.issues) {
        message += `${p.gray('┃')} ${issue.path.join(' → ')} ${p.gray(`(${issue.message})`)}\n`
      }
      console.log(message)
    } else {
      console.log({ message: error.message, string: s })
    }
    process.exit(1)
  }
}
const env = {
  ...parsePrivate(process.env.PRIVATE!),
  rootPath: process.env.NODE_ENV ? `${process.cwd()}/dist` : `${process.cwd()}/src`
}
const setting = {
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

const config = {
  setting,
  env,
  utils: {
    imageTransparent: 'https://i.imgur.com/m8BHGOt.png',
    imageAvatar: 'https://i.imgur.com/LB7cfKh.png',
    oneDay: 24 * 60 * 60 * 1000,
    middleMinutes: 30 * 1000,
    isProduction: process.env.NODE_ENV === 'production'
  }
}
export type Config = typeof config
globalThis.config = config
