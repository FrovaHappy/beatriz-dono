import BuildButton from '@/core/build/BuildButtons'
import BuildMenu from '@/core/build/BuildMenu'
import { ButtonStyle } from 'discord.js'
import BuildModal from './build/BuildModal'

const defaultMenu = new BuildMenu({
  customId: '',
  scope: 'free',
  permissionsBot: [],
  permissionsUser: [],
  typeData: 'string',
  translates: {
    default: {
      placeholder: 'Menu Not Found',
      options: []
    }
  },
  resolve: 'defer',
  ephemeral: true,
  execute: async _e => undefined
})

const defaultButton = new BuildButton({
  customId: '',
  scope: 'free',
  permissionsBot: [],
  permissionsUser: [],
  style: ButtonStyle.Secondary,
  translates: {
    default: {
      name: 'Button Not Found'
    }
  },
  resolve: 'defer',
  ephemeral: true,
  execute: async _e => undefined
})

const defaultModal = new BuildModal({
  customId: '',
  scope: 'free',
  permissionsBot: [],
  permissionsUser: [],
  translates: {
    title: {
      default: 'Modal Not Found'
    },
    components: []
  },
  resolve: 'defer',
  ephemeral: true,
  execute: async _e => ({ content: 'Modal Not Found' }),
  dataButton: {
    style: ButtonStyle.Secondary,
    translates: {
      default: {
        name: 'Modal Not Found'
      },
      'es-ES': {
        name: 'Modal No Encontrado'
      }
    }
  }
})

export default {
  menu: defaultMenu,
  button: defaultButton,
  modal: defaultModal
}
