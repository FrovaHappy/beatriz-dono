import { ButtonStyle, Collection } from 'discord.js'
import BuildButton from './build/BuildButtons'
import type BuildCommand from './build/BuildCommand'
import BuildMenu, { type SelectMenu } from './build/BuildMenu'
import BuildModal from './build/BuildModal'
import * as listImports from '@/listImports'
import { Timer } from '@/shared/general'
import logger from '@/shared/logger'

const buttons = new Collection<string, BuildButton>()
const commands = new Collection<string, BuildCommand>()
const menus = new Collection<string, BuildMenu<'string'>>()
const modals = new Collection<string, BuildModal>()

function getMenus<T extends keyof SelectMenu = 'string'>(key: string): BuildMenu<T> {
  const menu = menus.get(key)
  if (menu) return menu as any
  return new BuildMenu({
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
}

function getButton(key: string): BuildButton {
  const button = buttons.get(key)
  if (button) return button as any
  return new BuildButton({
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
}

function getModal(key: string): BuildModal {
  const modal = modals.get(key)
  if (modal) return modal as any
  return new BuildModal({
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
    cooldown: 0,
    dataButton: {
      style: ButtonStyle.Secondary,
      translates: {
        default: {
          name: 'Modal Not Found'
        }
      }
    },
    resolve: 'defer',
    ephemeral: true,
    execute: async _e => ({})
  })
}

export type GetMenu = typeof getMenus
export type GetButton = typeof getButton
export type GetModal = typeof getModal

globalThis.buttons = getButton
globalThis.commands = commands
globalThis.menus = getMenus
globalThis.modals = getModal

export default async function getServices() {
  for (const command of Object.entries(listImports.commands)) {
    const [, instance] = command
    globalThis.commands.set(instance.name, instance)
  }
  for (const menu of Object.entries(listImports.menus)) {
    const [, service] = menu
    menus.set(service.customId, service)
  }
  for (const button of Object.entries(listImports.buttons)) {
    const [, service] = button
    buttons.set(service.customId, service)
  }
  for (const modal of Object.entries(listImports.modals)) {
    const [, service] = modal
    modals.set(service.customId, service)
    buttons.set(`modal-${service.customId}`, service.button)
  }
  logger({
    type: 'info',
    head: 'Services',
    title: 'Loading services',
    body: `
      buttons found: ${buttons.size}  
      commands found: ${globalThis.commands.size}  
      menus found: ${menus.size}  
      modals found: ${modals.size}
    `
  })
}
