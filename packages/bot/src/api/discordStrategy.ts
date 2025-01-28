import type { DataUser } from '@/api/types'
import { PermissionsBitField } from 'discord.js'
import { Strategy } from 'passport-discord'
import { getGuild } from '@/rest/guild'

export default new Strategy(
  {
    clientID: config.env.discord.applicationId,
    clientSecret: config.env.discord.oAuthSecret,
    callbackURL: config.env.discord.oAuthCallback,
    scope: ['identify', 'guilds']
  },
  async (accessToken, refreshToken, profile, done) => {
    const guilds = []
    for (const guild of profile.guilds ?? []) {
      const isAdmin = new PermissionsBitField(BigInt(guild.permissions)).has('Administrator')
      if (!isAdmin) continue
      const guildBot = await getGuild(guild.id)

      guilds.push({
        name: guild.name,
        owner: guild.owner,
        icon: guild.icon,
        isAdmin: !!guildBot,
        id: guild.id
      })
    }

    const user: DataUser = {
      id: profile.id,
      username: profile.username,
      avatar: profile.avatar,
      guilds: guilds
    }
    done(null, user)
  }
)