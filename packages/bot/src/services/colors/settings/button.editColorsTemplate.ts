import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import type { Modal } from '@/core/build/BuildModal'
import messages from '@/messages'
import { ButtonBuilder, ButtonStyle } from 'discord.js'

export default new BuildButton({
  name: ButtonNames.editColorDefault,
  scope: 'private',
  data: new ButtonBuilder().setLabel('Edit colors default').setStyle(ButtonStyle.Secondary),
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  resolve: 'showModal',
  execute: async i => {
    if (!i.guildId) return messages.guildIdNoFound(i.locale)
    const colorsDefaultModal: Modal = modals.get(i.customId)
    if (!colorsDefaultModal) throw new Error('Modal not found')

    await i.showModal(colorsDefaultModal.data)
  }
})
