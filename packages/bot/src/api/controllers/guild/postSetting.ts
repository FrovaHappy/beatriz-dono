import type { ValidateZodProps } from '@/api/shared/validateZod'
import rest from '@/rest'
import db from '@db'
import type { Request, Response } from 'express'
import z from 'zod'

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
  const guild = await rest.guild.read(guildId)
  if (!guild) {
    res.json({ data: null, message: 'Guild not found', ok: false })
    return
  }
  const update = await db.guild.read(guildId)
  res.status(201).json({
    data: update,
    message: 'Setting saved',
    ok: true
  })
}
