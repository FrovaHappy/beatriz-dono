import { ButtonStyle, Collection } from 'discord.js'
import p from 'picocolors'
import BuildButton from './build/BuildButtons'
import type BuildCommand from './build/BuildCommand'
import BuildMenu, { type SelectMenu } from './build/BuildMenu'
import BuildModal from './build/BuildModal'
import * as listImports from '@/listImports'

const buttons = new Collection<string, BuildButton>()
const commands = new Collection<string, BuildCommand>()
const menus = new Collection<string, BuildMenu<'string'>>()
const modals = new Collection<string, BuildModal>()

function getMenus<T extends keyof SelectMenu = 'string'>(key: string): BuildMenu<T> {
  const menu = menus.get(key)
  if (menu) return menu as any
  return new BuildMenu({
    customId: '',
    scope: 'owner',
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
    scope: 'owner',
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
    scope: 'owner',
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
  console.log(`${p.green('[services]')} Loading services`)
  for (const command of Object.entries(listImports.commands)) {
    const [, instance] = command
    globalThis.commands.set(instance.name, instance)
  }
  for (const menu of Object.entries(listImports.menus)) {
    const [, service] = menu
    const existMenu = !!menus.get(service.customId)
    if (existMenu) throw new Error(`Menu ${service.customId} already exists`)
    menus.set(service.customId, service)
  }
  for (const button of Object.entries(listImports.buttons)) {
    const [, service] = button
    const existButton = !!buttons.get(service.customId)
    if (existButton) throw new Error(`Button ${service.customId} already exists`)
    buttons.set(service.customId, service)
  }
  for (const modal of Object.entries(listImports.modals)) {
    const [, service] = modal
    const existModal = !!modals.get(service.customId)
    if (existModal) throw new Error(`Modal ${service.customId} already exists`)
    modals.set(service.customId, service)
    buttons.set(`modal-${service.customId}`, service.button)
  }
  const logs = [
    `${p.green('[services]')} Done:`,
    `  ∷ buttons found: ${p.bold(buttons.size)}`,
    `  ∷ commands found: ${p.bold(globalThis.commands.size)}`,
    `  ∷ menus found: ${p.bold(menus.size)}`,
    `  ∷ modals found: ${p.bold(modals.size)}`
  ]
  console.log(logs.join('\n'))
}
