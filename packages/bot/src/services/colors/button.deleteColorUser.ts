import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonBuilder, ButtonStyle } from 'discord.js'
import { removeRolesOfUser } from './shared/removeRoles'
import messages, { messagesColors } from '@/messages'
import db from '@/core/database'

export default new BuildButton({
  name: ButtonNames.removeColor,
  scope: 'private',
  permissionsBot: ['ManageRoles'],
  resolve: 'update',
  data: new ButtonBuilder().setLabel('Eliminar color').setStyle(ButtonStyle.Secondary),
  async execute(i) {
    const { guildId, locale } = i
    const roles = i.guild?.roles.cache

    if (!guildId) return messages.guildIdNoFound(locale)
    const { pointer_id, colors } = await db.colors.read(guildId)
    const colorPointerId = i.guild?.roles.cache.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

    const logDeleteRoles = await removeRolesOfUser(roles, colors, i)
    return messagesColors.deleteColorUser(locale, logDeleteRoles.total)
  }
})
