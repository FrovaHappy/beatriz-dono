import { z } from 'zod'
import logger, { info } from './shared/logger'

try {
  process.loadEnvFile('../../.env')
} catch (_) {
  try {
    process.loadEnvFile()
  } catch (_) {
    logger({ type: 'warn', head: 'Load Env', title: 'This is working without .env file' })
  }
}

const runValidation = () => {
  const envSchema = z.object({
    PRIVATE: z.string(),
    PORT: z.string()
  })
  try {
    envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      let body = ''
      for (const issue of error.issues) {
        body += `${issue.path.join(' → ')} ${`(${issue.message})`}\n`
      }
      logger({ type: 'error', head: 'Load Env', title: 'Invalid env config:', body })
    }
    process.exit(1)
  }
}
runValidation()

function parsePrivate(s: string) {
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
      api: z.object({
        secretKey: z.string(),
        urlClientDomain: z.string().url()
      }),
      sql: z.object({
        syncUrl: z.string(),
        token: z.string()
      })
    })
    .strict()
  type Private = z.infer<typeof privateSchema>
  try {
    return privateSchema.parse(JSON.parse(s)) as Private
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      let body = ''
      for (const issue of error.issues) {
        body += `${issue.path.join(' → ')} ${info(`(${issue.message})`)}\n`
      }
      logger({ type: 'error', head: 'Load Env', title: 'Invalid env.PRIVATE config:', body })
    } else {
      logger({ type: 'error', head: 'Load Env', title: 'Invalid env.PRIVATE config:', body: error.message })
    }
    process.exit(1)
  }
}
const env = {
  ...parsePrivate(process.env.PRIVATE!),
  rootPath: `${process.cwd()}/src`,
  port: process.env.PORT!
}
const setting = {
  cooldown: 5, // 5 segundos
  privatesServers: [] as string[],
  ownersServers: [env.discord.guildOwner],
  linkDiscord: 'https://discord.gg/JRpHsGC8YQ',
  linkGithub: 'https://github.com/FrovaHappy/beatriz-dono',
  linkDocumentation: 'https://beatrizbot.vercel.app/home',
  linkWebsite: 'https://beatrizbot.vercel.app/',
  linkKofi: 'https://ko-fi.com/frovahappy',
  linkTopgg: 'https://top.gg/bot/971562890702237766',
  linkBotList: 'https://discordbotlist.com/bots/beatrizdono-beta'
}

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
