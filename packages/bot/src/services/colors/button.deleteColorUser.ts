import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonBuilder, ButtonStyle } from 'discord.js'
import fetchColorCommand from './shared/fetchColorCommand'
import { removeRolesOfUser } from './shared/removeRoles'
import messages, { messagesColors } from '@/messages'

export default new BuildButton({
  name: ButtonNames.removeColor,
  permissions: [],
  resolve: 'update',
  data: new ButtonBuilder().setLabel('Eliminar color').setStyle(ButtonStyle.Secondary),
  async execute(i) {
    const { guildId, locale } = i
    const roles = i.guild?.roles.cache

    if (!guildId) return messages.guildIdNoFound(locale)
    const { colorPointerId, colors } = await fetchColorCommand(guildId, roles)
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

    const logDeleteRoles = await removeRolesOfUser(roles, colors, i)
    return messagesColors.deleteColorUser(locale, logDeleteRoles.total)
  }
})
