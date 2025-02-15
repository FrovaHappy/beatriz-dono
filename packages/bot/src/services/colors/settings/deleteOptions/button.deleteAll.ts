import BuildButton from '@/core/build/BuildButtons'
import messages, { messagesColors } from '@/messages'
import { ButtonBuilder, ButtonStyle } from 'discord.js'
import { removeRolesOfServer } from '../../shared/removeRoles'
import { ButtonNames } from '@/const/interactionsNames'
import db from '@/database'

export default new BuildButton({
  name: ButtonNames.deleteServerAllColors,
  scope: 'public',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  resolve: 'update',
  cooldown: 15,
  data: new ButtonBuilder().setLabel('Yes').setStyle(ButtonStyle.Danger),
  execute: async i => {
    const { guildId, locale } = i
    if (!guildId) return messages.guildIdNoFound(locale)
    const { pointer_id, colors } = await db.colors.read(guildId)
    const colorPointerId = i.guild?.roles.cache.get(pointer_id ?? '0')?.id
    const roles = i.guild?.roles.cache
    if (!colorPointerId) return messagesColors.initColorPointer(locale)
    await removeRolesOfServer(roles, colors, i)
    await db.colors.delete(guildId, colors)
    return messagesColors.settingsColorsDelete.deleteAllConfirmed(locale, colors.length)
  }
})
