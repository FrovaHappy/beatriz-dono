import type { Request, Response } from 'express'
import { getGuild } from '@/rest/guild'
import db from '@/core/db'
import type { ValidateZodProps } from '@/api/shared/validateZod'
import z from 'zod'

const schemaParams = z.object({ guildId: z.string().max(24) })

export const validateGetSetting: ValidateZodProps = { params: schemaParams }

export default async function getSetting(req: Request, res: Response) {
  const { guildId } = req.params as z.infer<typeof schemaParams>

  const guild = await getGuild(guildId)

  if (!guild) {
    res.json({ data: null, message: 'Guild not found', ok: false })
    return
  }

  const setting = await db.serverSetting.upsert({
    where: { serverId: guildId },
    create: {
      serverId: guildId
    },
    update: {}
  })

  res.json({
    data: setting,
    message: 'Guild found',
    ok: true
  })
}
