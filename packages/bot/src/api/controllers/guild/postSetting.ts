import z from 'zod'
import type { Request, Response } from 'express'
import type { ValidateZodProps } from '@/api/shared/validateZod'
import db from '@/core/db'
import { getGuild } from '@/rest/guild'

const schemaBody = z
  .object({
    guildId: z.string().max(24),
    colorActive: z.boolean().optional(),
    welcomeActive: z.boolean().optional()
  })
  .strict()

export const validatePostSetting: ValidateZodProps = { body: schemaBody }

export default async function postSetting(req: Request, res: Response) {
  const { guildId, ...settingBody } = req.body as z.infer<typeof schemaBody>
  const guild = await getGuild(guildId)
  if (!guild) {
    res.json({ data: null, message: 'Guild not found', ok: false })
    return
  }
  const update = await db.serverSetting.upsert({
    where: { serverId: guildId },
    create: {
      serverId: guildId,
      ...settingBody
    },
    update: settingBody
  })
  res.status(201).json({
    data: update,
    message: 'Setting saved',
    ok: true
  })
}
