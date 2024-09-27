import db from '@/core/db'
import type { Color } from '@prisma/client'
import { type ChatInputCommandInteraction, resolveColor } from 'discord.js'

interface CreateColorRoleProps<T> {
  hexColor: `#${string}`
  colors: Color[] | undefined
  guildId: string
  colorPointerId: string
  i: T extends ChatInputCommandInteraction ? T : any
}

export default async function createColorRole<T>(props: CreateColorRoleProps<T>) {
  const { hexColor, guildId, colors, colorPointerId, i } = props
  const guildRoles = i.guild?.roles.cache
  const color = colors?.find(color => color.hexcolor === hexColor)
  let colorRole = guildRoles?.find(role => role.id === color?.roleId)
  // verify if the role exists if not create it
  if (!colorRole) {
    colorRole = await i.guild?.roles.create({
      name: `🌿${hexColor}🌼 `,
      color: resolveColor(hexColor),
      permissions: '0',
      reason: 'Beatriz-Dono to create a new role color'
    })
  }
  if (!colorRole) return null

  // verify if the role is the same color if not change it
  if (colorRole.color !== resolveColor(hexColor)) await colorRole.setColor(hexColor)

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
