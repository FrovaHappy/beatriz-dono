import { PermissionBot } from '@prisma/client'
import db from '../db'

export default async function createServerDb(serverId: string, isOwner = false, isPrivate = false): Promise<void> {
  const permissionsBot: PermissionBot[] = [PermissionBot.public]
  if (isOwner) permissionsBot.push(PermissionBot.owner)
  if (isPrivate) permissionsBot.push(PermissionBot.private)
  await db.server.upsert({
    where: { serverId },
    create: { serverId, permissionsBot },
    update: { permissionsBot }
  })
}
