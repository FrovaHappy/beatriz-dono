import BuildButton from '@/core/build/BuildButtons'
import { messagesColors } from '@/messages'
import db from '@/database'
import msgColorPointerCreated from '../msg.ColorPointerCreated'
import { ButtonStyle } from 'discord.js'

export default new BuildButton({
  customId: 'setting',
  scope: 'public',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  resolve: 'update',
  translates: {
    default: {
      name: 'Setting',
      style: ButtonStyle.Primary
    },
    'es-ES': {
      name: 'Configuración',
      style: ButtonStyle.Primary
    }
  },
  execute: async i => {
    const { guildId, locale } = i
    const roles = i.guild?.roles.cache
    if (!guildId) throw new Error('Guild ID not found')
    const { pointer_id } = await db.colors.read(guildId)
    const colorPointerId = roles?.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return msgColorPointerCreated.getMessage(locale, {})

    return messagesColors.setting(locale)
  }
})
