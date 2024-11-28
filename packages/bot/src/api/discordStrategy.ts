import type { DataUser } from '@/api/types'
import { PermissionsBitField } from 'discord.js'
import { Strategy } from 'passport-discord'

export default new Strategy(
  {
    clientID: config.discordClient,
    clientSecret: config.discordOauthSecret,
    callbackURL: config.urlOathCallback,
    scope: ['identify', 'guilds']
  },
  async (accessToken, refreshToken, profile, done) => {
    const guilds = profile.guilds?.map(guild => {
      let isAdmin = false
      if (new PermissionsBitField(BigInt(guild.permissions)).has('Administrator')) isAdmin = true
      return {
        name: guild.name,
        owner: guild.owner,
        icon: guild.icon,
        isAdmin,
        id: guild.id
      }
    })
    const user: DataUser = {
      token: accessToken,
      id: profile.id,
      username: profile.username,
      avatar: profile.avatar,
      guilds: guilds ?? []
    }
    done(null, user)
  }
)