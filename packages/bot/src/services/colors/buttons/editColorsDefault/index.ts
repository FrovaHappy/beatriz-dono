import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { type Modal } from '@/core/build/BuildModal'
import { ButtonBuilder, ButtonStyle } from 'discord.js'

export default new BuildButton({
  name: ButtonNames.editColorDefault,
  data: new ButtonBuilder().setLabel('Edit colors default').setStyle(ButtonStyle.Secondary),
  permissions: [],
  resolve: 'reply',
  execute: async i => {
    const { modals } = globalThis
    if (!i.guildId) return { content: 'Guild not found' }
    const colorsDefaultModal: Modal = modals.get(i.customId)
    if (!colorsDefaultModal) return { content: 'Modal not found' }

    await i.showModal(colorsDefaultModal.data)
  }
})
