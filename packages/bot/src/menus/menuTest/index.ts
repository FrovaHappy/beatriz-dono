import { MenuNames, ModalNames } from '@/const/interactionsNames'
import BuildMenu from '@/core/build/BuildMenu'
import { type Modal } from '@/core/build/BuildModal'
import { type GuildMember, PermissionsBitField, StringSelectMenuBuilder } from 'discord.js'

export default new BuildMenu({
  name: MenuNames.test,
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
    const modal: Modal = globalThis.modals.get(ModalNames.test)
    switch (value) {
      case 'pikachu':
        // e.channel?.delete()
        break
      case 'bulbasaur':
        await e.showModal(modal.data)
        break
      default:
        break
    }
  }
})
