import BuildButton from '@/core/build/BuildButtons'
import db from '@/database'
import { ButtonStyle } from 'discord.js'
import msgCreatePointerColor from '../../msg.createPointerColor'
import { removeRolesOfServer } from '../../shared/removeRoles'
import msgDeleteAll from './msg.deleteAll'

export default new BuildButton({
  customId: 'settingsConfirmDeleteAll',
  scope: 'free',
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
    const query = await db.colors.read({ guild_id: guildId })
    if (!query) throw new Error('error in query Database')
    const { colors, pointer_id } = query
    const colorPointerId = i.guild?.roles.cache.get(pointer_id ?? '0')?.id
    const roles = i.guild?.roles.cache
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})
    await removeRolesOfServer(roles, colors, i)
    await db.colors.delete({ guild_id: guildId, colors })
    return msgDeleteAll.getMessage(locale, { '{{slot0}}': colors.length.toString() })
  }
})
