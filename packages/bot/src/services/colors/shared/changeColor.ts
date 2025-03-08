import type { Color } from '@/database/queries/colors'
import { messagesColors } from '@/messages'
import type { GuildMemberRoleManager, Interaction, Locale } from 'discord.js'
import createColorRole from './createColorRole'
import msgColorChanged from './msg.colorChanged'
import msgColorIncorrect from './msg.colorIncorrect'
import { removeRolesOfUser } from './removeRoles'

interface ChangeColorProps {
  colorCustom: string
  colorPointerId: string
  colors: Color[]
  guildId: string
  i: Interaction
  locale: Locale
}

const regexColors = /^#([a-f0-9]{6})$/
export async function changeColor(props: ChangeColorProps) {
  const { colorCustom, guildId, i, locale, colors, colorPointerId } = props
  const roles = i.guild?.roles.cache
  // Logic
  if (!regexColors.test(colorCustom)) return msgColorIncorrect.getMessage(locale, { '{{slot0}}': colorCustom })
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
