import { MenuNamesKeys } from '@/const/MenuMames'
import BuildMenu from '@/core/build/BuildMenu'
import {
  ActionRowBuilder,
  type GuildMember,
  ModalBuilder,
  PermissionsBitField,
  StringSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js'

export default new BuildMenu({
  name: MenuNamesKeys.test,
  permissions: [],
  ephemeral: true,
  defer: false,
  data: new StringSelectMenuBuilder().setPlaceholder('soy un placeholder').addOptions(
    {
      label: 'Pikachu',
      description: 'The Electric Pokémon.',
      value: 'pikachu',
      emoji: { name: '5_', id: '951886661783007232' },
      default: true
    },
    {
      label: 'Bulbasaur',
      description: 'The Grass Pokémon.',
      value: 'bulbasaur',
      emoji: { name: '5_', id: '951886661783007232' }
    }
  ),
  menuType: 'string',
  execute: async e => {
    const value = e.values[0]
    const permissions = PermissionsBitField.Flags.ManageMessages || PermissionsBitField.Flags.Administrator
    const member = e.member as GuildMember // solo para que me coloque los tipos
    if (!member.permissions.has(permissions)) {
      return {
        content: 'No eres moderador para usar este comando!'
      }
    }

    const modal = new ModalBuilder()
      .setCustomId('modalSocio')
      .setTitle('Añadir rol a nuevo socio!')
      .addComponents(
        new ActionRowBuilder({
          components: [
            new TextInputBuilder()
              .setCustomId('memberid')
              .setStyle(TextInputStyle.Paragraph)
              .setLabel('Ingresa el ID del Usuario!')
              .setMaxLength(30)
          ]
        })
      )

    switch (value) {
      case 'pikachu':
        // e.channel?.delete()
        break
      case 'bulbasaur':
        await e.showModal(modal)
        break
      default:
        break
    }
  }
})
