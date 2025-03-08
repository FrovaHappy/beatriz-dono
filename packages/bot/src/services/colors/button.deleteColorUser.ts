import BuildButton from '@/core/build/BuildButtons'
import db from '@db'
import { ButtonStyle } from 'discord.js'
import msgCreatePointerColor from './msg.createPointerColor'
import { removeRolesOfUser } from './shared/removeRoles'
import msgColorOfUserDeleted from './msg.colorOfUserDeleted'

export default new BuildButton({
  customId: 'deleteColor',
  scope: 'public',
  permissionsBot: ['ManageRoles'],
  permissionsUser: [],
  resolve: 'update',
  style: ButtonStyle.Secondary,
  translates: {
    default: {
      name: 'clear Color'
    },
    'es-ES': {
      name: 'Eliminar color'
    }
  },
  async execute(i) {
    const { guildId, locale } = i
    const roles = i.guild?.roles.cache

    if (!guildId) throw new Error('Guild ID not found')
    const { pointer_id, colors } = await db.colors.read(guildId)
    const colorPointerId = i.guild?.roles.cache.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})

    const logDeleteRoles = await removeRolesOfUser(roles, colors, i)
    return msgColorOfUserDeleted.getMessage(locale, { '{{slot0}}': logDeleteRoles.total.toString() })
  }
})
