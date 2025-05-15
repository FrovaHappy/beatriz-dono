import BuildButton from '@/core/build/BuildButtons'
import db from '@db'
import { ButtonStyle } from 'discord.js'
import msgColorOfUserDeleted from './msg.colorOfUserDeleted'
import msgCreatePointerColor from './msg.createPointerColor'
import { removeRolesOfUser } from './shared/removeRoles'

export default new BuildButton({
  customId: 'deleteColor',
  scope: 'free',
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
    const query = await db.colors.read({ guild_id: guildId })
    if (!query) throw new Error('error in query Database')
    const { colors, pointer_id } = query
    const colorPointerId = i.guild?.roles.cache.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})

    const logDeleteRoles = await removeRolesOfUser(roles, colors, i)
    return msgColorOfUserDeleted.getMessage(locale, { '{{slot0}}': logDeleteRoles.total.toString() })
  }
})
