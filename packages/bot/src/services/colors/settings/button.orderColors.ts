import BuildButton from '@/core/build/BuildButtons'
import db from '@/database'
import { ButtonStyle, type RolePosition } from 'discord.js'
import msgCreatePointerColor from '../msg.createPointerColor'
import msgOrderColors from './msg.orderColors'

export default new BuildButton({
  customId: 'orderColors',
  scope: 'private',
  style: ButtonStyle.Primary,
  translates: {
    default: {
      name: 'Order Colors'
    },
    'es-ES': {
      name: 'Ordenar colores'
    }
  },
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  ephemeral: true,
  resolve: 'update',
  execute: async i => {
    const { guildId, locale } = i
    const roles = i.guild?.roles.cache

    if (!guildId) throw new Error('Guild ID not found')
    const query = await db.colors.read({ guild_id: guildId })
    if (!query) throw new Error('error in query Database')
    const { colors, pointer_id } = query
    const colorPointerId = roles?.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})

    const colorPointer = roles.get(colorPointerId)!
    const colorsForOrder: RolePosition[] = []
    for (const role of roles.values()) {
      const hasColor = colors.some(color => color.role_id === role.id)
      if (hasColor) colorsForOrder.push({ position: colorPointer.position, role: role })
    }
    await i.guild?.roles.setPositions(colorsForOrder)

    return msgOrderColors.getMessage(locale, {})
  }
})
