import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonBuilder, ButtonStyle } from 'discord.js'
import fetchColorCommand from '../shared/fetchColorCommand'
import messages, { messagesColors } from '@/messages'

export default new BuildButton({
  name: ButtonNames.setting,
  scope: 'public',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  resolve: 'update',
  data: new ButtonBuilder().setCustomId('setting').setLabel('Configuración').setStyle(ButtonStyle.Primary),
  execute: async i => {
    const { guildId, locale } = i
    if (!guildId) return messages.guildIdNoFound(locale)
    const { colorPointerId } = await fetchColorCommand(guildId, i.guild?.roles.cache)
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

    return messagesColors.setting(locale)
  }
})
