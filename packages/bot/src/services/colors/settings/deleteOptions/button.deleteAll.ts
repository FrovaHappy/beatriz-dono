import BuildButton from '@/core/build/BuildButtons'
import messages, { messagesColors } from '@/messages'
import { ButtonBuilder, ButtonStyle } from 'discord.js'
import fetchColorCommand from '../../shared/fetchColorCommand'
import { removeRolesOfDb, removeRolesOfServer } from '../../shared/removeRoles'
import { ButtonNames } from '@/const/interactionsNames'

export default new BuildButton({
  name: ButtonNames.deleteServerAllColors,
  scope: 'public',
  permissionsBot: ['ManageRoles'],
  resolve: 'update',
  cooldown: 15,
  data: new ButtonBuilder().setLabel('Yes').setStyle(ButtonStyle.Danger),
  execute: async i => {
    const { guildId, locale } = i
    if (!guildId) return messages.guildIdNoFound(locale)
    const { colorPointerId, colors } = await fetchColorCommand(guildId, i.guild?.roles.cache)
    const roles = i.guild?.roles.cache
    if (!colorPointerId) return messagesColors.initColorPointer(locale)
    await removeRolesOfServer(roles, colors, i)
    await removeRolesOfDb(roles, colors, i)
    return messagesColors.settingsColorsDelete.deleteAllConfirmed(locale, colors.length)
  }
})