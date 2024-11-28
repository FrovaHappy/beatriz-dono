import type { Request, Response } from 'express'
import { REST, Routes } from 'discord.js'
import type { DataUser } from '@/api/types'

export default function getGuild(req: Request, res: Response) {
  if (!req.isAuthenticated()) {
    res.json({ data: null, message: 'No user logged in', ok: false })
    return
  }
  const guildId = req.params.guildId
  const user = req.user as DataUser
  const rest = new REST({ version: '10' }).setToken(user.token)

  const guild = rest.get(Routes.guild(user.id))

  res.json({
    data: guild,
    message: 'Guild found',
    ok: true
  })
}