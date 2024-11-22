import db from '@/core/db'
import type { Color } from '@prisma/client'
import { type ChatInputCommandInteraction, resolveColor } from 'discord.js'

interface CreateColorRoleProps<T> {
  hexColor: `#${string}`
  colors: Color[] | undefined
  guildId: string
  colorPointerId: string
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  i: T extends ChatInputCommandInteraction ? T : any
}

export default async function createColorRole<T>(props: CreateColorRoleProps<T>) {
  const { hexColor, guildId, colors, colorPointerId, i } = props
  const guildRoles = i.guild?.roles.cache
  const color = colors?.find(color => color.hexcolor === hexColor)
  let colorRole = guildRoles?.find(role => role.id === color?.roleId)
  const position = guildRoles?.get(colorPointerId)?.position ?? 0
  // verify if the role exists if not create it
  if (!colorRole) {
    // verify if the role exists if not create it
    colorRole = await i.guild?.roles.create({
      name: `🌿${hexColor}🌼 `,
      color: resolveColor(hexColor),
      permissions: '0',
      reason: 'Beatriz-Dono to create a new role color'
    })
  }

  if (!colorRole) return null
  // update the color and position of the role
  await colorRole.edit({ position: position, color: resolveColor(hexColor) })

  // upsert the color in the database
  await db.colorCommand.update({
    where: { serverId: guildId },
    data: {
      colorPointerId,
      colors: {
        upsert: {
          where: { roleId: colorRole.id },
          update: {
            roleId: colorRole.id
          },
          create: {
            roleId: colorRole.id,
            hexcolor: hexColor
          }
        }
      }
    }
  })

  return colorRole
}
