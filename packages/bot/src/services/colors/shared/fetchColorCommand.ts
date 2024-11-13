import db from '@/core/db'
import type { Collection, Role } from 'discord.js'
import type { Colors } from '../schema.color'

/**
 * This function is used to fetch the color command from the database.
 * @param guildId the guild id of the server
 * @param roles is o collection of roles of the server (required for compare the colorPointerId)
 * @returns the color command from the database
 */

export default async function fetchColorCommand(guildId: string, roles?: Collection<string, Role>) {
  let colorCommand = await db.colorCommand.findUnique({
    where: { serverId: guildId },
    include: { colors: true }
  })
  if (!colorCommand) {
    colorCommand = (
      await db.server.upsert({
        where: { serverId: guildId },
        create: {
          serverId: guildId,
          permissionsBot: ['public'],
          colorCommand: {
            create: {}
          }
        },
        update: {
          colorCommand: {
            create: {}
          }
        },
        include: { colorCommand: { include: { colors: true } } }
      })
    ).colorCommand!
  }
  if (colorCommand.colorPointerId) colorCommand.colorPointerId = roles?.get(colorCommand.colorPointerId)?.id ?? null
  return colorCommand as unknown as Omit<typeof colorCommand, 'colorsDefault'> & { colorsDefault: Colors | undefined }
}
