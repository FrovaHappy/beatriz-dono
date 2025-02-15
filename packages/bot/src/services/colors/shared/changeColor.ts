import { messagesColors } from '@/messages'
import type { GuildMemberRoleManager, Interaction, Locale } from 'discord.js'
import createColorRole from './createColorRole'
import { removeRolesOfUser } from './removeRoles'
import type { Color } from '@/database/queries/colors'

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
  if (!regexColors.test(colorCustom)) return messagesColors.colorIncorrect(locale, colorCustom)
  const colorRole = await createColorRole({
    hexColor: colorCustom as `#${string}`,
    guildId,
    colors,
    colorPointerId,
    i
  })
  if (!colorRole) return messagesColors.errorCreatingColor({ locale })

  await removeRolesOfUser(roles, colors, i)
  await (i.member?.roles as GuildMemberRoleManager).add(colorRole)
  return messagesColors.changedColorsUser({ locale, color: colorRole.id })
}
