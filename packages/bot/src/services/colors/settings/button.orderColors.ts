import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import db from '@/database'
import messages, { messagesColors } from '@/messages'
import { ButtonBuilder, ButtonStyle, type RolePosition } from 'discord.js'

export default new BuildButton({
  name: ButtonNames.serverColorOrder,
  scope: 'private',
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
    const roles = i.guild?.roles.cache

    if (!guildId) return messages.guildIdNoFound(locale)
    const { colors, pointer_id } = await db.colors.read(guildId)
    const colorPointerId = roles?.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

    const colorPointer = roles.get(colorPointerId)!
    const colorsForOrder: RolePosition[] = []
    for (const role of roles.values()) {
      const hasColor = colors.some(color => color.role_id === role.id)
      if (hasColor) colorsForOrder.push({ position: colorPointer.position, role: role })
    }
    await i.guild?.roles.setPositions(colorsForOrder)

    return messagesColors.orderColors(locale)
  }
})
