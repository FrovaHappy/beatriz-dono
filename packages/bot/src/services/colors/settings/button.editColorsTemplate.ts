import BuildButton from '@/core/build/BuildButtons'
import type { Modal } from '@/core/build/BuildModal'
import messages from '@/messages'
import { ButtonStyle } from 'discord.js'

export default new BuildButton({
  customId: 'editColorsTemplate',
  scope: 'private',
  translates: {
    default: {
      name: 'Edit Template',
      style: ButtonStyle.Primary
    },
    'es-ES': {
      name: 'Editar Plantilla',
      style: ButtonStyle.Primary
    }
  },
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
