import BuildButton from '@/core/build/BuildButtons'
import { ButtonStyle } from 'discord.js'
import { removeRolesOfServer } from '../../shared/removeRoles'
import db from '@/database'
import msgCreatePointerColor from '../../msg.createPointerColor'
import msgDeleteAll from './msg.deleteAll'

export default new BuildButton({
  customId: 'settingsConfirmDeleteAll',
  scope: 'public',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  resolve: 'update',
  cooldown: 15,
  style: ButtonStyle.Danger,
  translates: {
    default: {
      name: 'Delete All'
    },
    'es-ES': {
      name: 'Eliminar todo'
    }
  },
  execute: async i => {
    const { guildId, locale } = i
    if (!guildId) throw new Error('Guild ID not found')
    const { pointer_id, colors } = await db.colors.read(guildId)
    const colorPointerId = i.guild?.roles.cache.get(pointer_id ?? '0')?.id
    const roles = i.guild?.roles.cache
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})
    await removeRolesOfServer(roles, colors, i)
    await db.colors.delete(guildId, colors)
    return msgDeleteAll.getMessage(locale, { '{{slot0}}': colors.length.toString() })
  }
})
