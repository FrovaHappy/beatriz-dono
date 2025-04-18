import type { Color } from '@/database/queries/colors'
import {
  type ChatInputCommandInteraction,
  resolveColor,
  type GuildMemberRoleManager,
  type Interaction,
  type Locale
} from 'discord.js'
import msgColorChanged from './msg.colorChanged'
import msgColorIncorrect from './msg.colorIncorrect'
import { removeRolesOfUser } from './removeRoles'
import db from '@db'
import re from '@libs/regex'

interface CreateColorRoleProps<T> {
  hexColor: `#${string}`
  colors: Color[]
  guildId: string
  colorPointerId: string
  i: T extends ChatInputCommandInteraction ? T : any
}

export default async function createColorRole<T>(props: CreateColorRoleProps<T>) {
  const { hexColor, guildId, colors, colorPointerId, i } = props
  const guildRoles = i.guild?.roles.cache
  const color = colors?.find(color => color.hex_color === hexColor)
  let colorRole = guildRoles?.find(role => role.id === color?.role_id)
  const position = guildRoles?.get(colorPointerId)?.position ?? 0
  // for that not insert the color in the database
  if (colorRole) {
    await colorRole.edit({ position: position, color: resolveColor(hexColor) })
    return colorRole
  }

  colorRole = await i.guild?.roles.create({
    name: `🌿${hexColor}🌼 `,
    color: resolveColor(hexColor),
    permissions: '0',
    reason: 'Beatriz-Dono to create a new role color'
  })

  if (!colorRole) return null
  // update the color and position of the role
  await colorRole.edit({ position: position, color: resolveColor(hexColor) })

  // upsert the color in the database
  await db.colors.insert({ guild_id: guildId, colors: [{ hex_color: hexColor, role_id: colorRole.id }] })

  return colorRole
}

interface ChangeColorProps {
  colorCustom: string
  colorPointerId: string
  colors: Color[]
  guildId: string
  i: Interaction
  locale: Locale
}

export async function changeColor(props: ChangeColorProps) {
  const { colorCustom, guildId, i, locale, colors, colorPointerId } = props
  const roles = i.guild?.roles.cache
  // Logic
  if (!colorCustom.match(re.hexColor)) return msgColorIncorrect.getMessage(locale, { '{{slot0}}': colorCustom })
  const colorRole = await createColorRole({
    hexColor: colorCustom as `#${string}`,
    guildId,
    colors,
    colorPointerId,
    i
  })
  if (!colorRole) throw new Error('Error creating color role in changeColor.ts')

  await removeRolesOfUser(roles, colors, i)
  await (i.member?.roles as GuildMemberRoleManager).add(colorRole)
  return msgColorChanged.getMessage(locale, { '{{slot0}}': colorRole.id })
}
