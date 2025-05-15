import BuildButton from '@/core/build/BuildButtons'
import db from '@/database'
import { ButtonStyle } from 'discord.js'
import msgColorPointerCreated from '../msg.ColorPointerCreated'
import msgIndex from './msg.index'

export default new BuildButton({
  customId: 'setting',
  scope: 'free',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  resolve: 'update',
  style: ButtonStyle.Primary,
  translates: {
    default: {
      name: 'Setting'
    },
    'es-ES': {
      name: 'Configuración'
    }
  },
  execute: async i => {
    const { guildId, locale } = i
    const roles = i.guild?.roles.cache
    if (!guildId) throw new Error('Guild ID not found')
    const query = await db.colors.read({ guild_id: guildId })
    if (!query) throw new Error('error in query Database')
    const { pointer_id } = query
    const colorPointerId = roles?.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return msgColorPointerCreated.getMessage(locale, {})

    return msgIndex.getMessage(locale, {})
  }
})
