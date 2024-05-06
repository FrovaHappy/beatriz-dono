import { ModalNamesKeys } from '@/const/ModalNames'
import BuildModal from '@/core/build/BuildModal'
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'

export default new BuildModal({
  name: ModalNamesKeys.test,
  permissions: [],
  ephemeral: true,
  cooldown: 0,
  scope: 'public',
  defer: true,
  data: new ModalBuilder().setTitle('Hola!!').addComponents(
    new ActionRowBuilder({
      components: [
        new TextInputBuilder()
          .setCustomId('user-id')
          .setStyle(TextInputStyle.Paragraph)
          .setLabel('Ingresa el ID del Usuario!')
          .setMaxLength(30)
      ]
    })
  ),
  execute: async (e, i18n) => {
    const value = e.fields.getTextInputValue('user-id')
    return {
      content: `Hola ${e.member?.user.username}! ${value}`
    }
  }
})
