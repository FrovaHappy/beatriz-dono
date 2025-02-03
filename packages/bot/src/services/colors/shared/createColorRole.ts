import db from '@/core/database'
import type { Color } from '@/core/database/queries/colors'
import { type ChatInputCommandInteraction, resolveColor } from 'discord.js'

interface CreateColorRoleProps<T> {
  hexColor: `#${string}`
  colors: Color[]
  guildId: string
  colorPointerId: string
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  i: T extends ChatInputCommandInteraction ? T : any
}

export default async function createColorRole<T>(props: CreateColorRoleProps<T>) {
  const { hexColor, guildId, colors, colorPointerId, i } = props
  const guildRoles = i.guild?.roles.cache
  const color = colors?.find(color => color.hex_color === hexColor)
  let colorRole = guildRoles?.find(role => role.id === color?.role_id)
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
  await db.colors.insert({ guild_id: guildId, colors: [{ hex_color: hexColor, role_id: colorRole.id }] })

  return colorRole
}
