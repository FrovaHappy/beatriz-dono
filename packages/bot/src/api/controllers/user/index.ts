import type { DataUser } from '@/api/types'
import type { Request, Response } from 'express'

export async function getUser(req: Request, res: Response) {
  const user = req.user as DataUser
  res.json({
    data: { avatar: user.avatar, username: user.username, id: user.id, guilds: user.guilds },
    message: 'User logged in',
    ok: true
  })
}
