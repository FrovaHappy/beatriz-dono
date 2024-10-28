import 'dotenv/config'
import process from 'node:process'

const env = {
  discordClient: process.env.DISCORD_CLIENT!,
  discordClientSecret: process.env.DISCORD_OAUTH_SECRET!,
  secretKey: process.env.SECRET_KEY!,
  urlClientDomain: process.env.URL_CLIENT_DOMAIN!
}
const utils = {
  oneDay: 24 * 60 * 60 * 1000
}
const config = { ...env, ...utils }
export type Config = typeof config
globalThis.config = config
