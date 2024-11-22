import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import messages, { messagesColors } from '@/messages'
import { ButtonBuilder, ButtonStyle, Collection, type RolePosition, type Role } from 'discord.js'
import fetchColorCommand from '../shared/fetchColorCommand'

export default new BuildButton({
  name: ButtonNames.serverColorOrder,
  data: new ButtonBuilder({
    label: 'Reordenar colores',
    style: ButtonStyle.Secondary
  }),
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  ephemeral: true,
  resolve: 'update',
  execute: async i => {
    const { guildId, locale } = i
    const roles = i.guild?.roles.cache ?? new Collection()

    if (!guildId) return messages.guildIdNoFound(locale)
    const { colors, colorPointerId } = await fetchColorCommand(guildId, roles)
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

    const colorPointer = roles.get(colorPointerId)!
    const colorsForOrder: RolePosition[] = []
    for (const role of roles.values()) {
      const hasColor = colors.some(color => color.id === role.id)
      if (hasColor) colorsForOrder.push({ position: colorPointer.position, role: role })
    }
    await i.guild?.roles.setPositions(colorsForOrder)

    return messagesColors.orderColors(locale)
  }
})
