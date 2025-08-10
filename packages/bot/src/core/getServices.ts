import * as listImports from '@/listImports'
import type { ClientEvents } from 'discord.js'
import type BuildButton from './build/BuildButtons'
import type BuildCommand from './build/BuildCommand'
import type BuildEvent from './build/BuildEvent'
import type BuildMenu from './build/BuildMenu'
import type { SelectMenu } from './build/BuildMenu'
import type BuildModal from './build/BuildModal'
import defaultGenerics from './generics'

let buttons = {} as Record<string, BuildButton>
let commands = {} as Record<string, BuildCommand>
let menus = {} as Record<string, BuildMenu>
let modals = {} as Record<string, BuildModal>
let events = {} as Record<string, BuildEvent<keyof ClientEvents>>

function getMenus<T extends keyof SelectMenu = 'string'>(key: string): BuildMenu<T> {
  const menu = menus[key]
  if (menu) return menu as any
  return defaultGenerics.menu as any
}

function getButton(key: string): BuildButton {
  const button = buttons[key]
  if (button) return button as any
  return defaultGenerics.button as any
}

function getModal(key: string): BuildModal {
  const modal = modals[key]
  if (modal) return modal as any
  return defaultGenerics.modal as any
}

export type GetMenu = typeof getMenus
export type GetButton = typeof getButton
export type GetModal = typeof getModal

export default async function getServices() {
  buttons = listImports.buttons
  commands = listImports.commands
  events = listImports.events
  menus = listImports.menus
  modals = listImports.modals

  for (const modal of Object.entries(listImports.modals)) {
    const [, service] = modal
    buttons[service.button.customId] = service.button
  }
  globalThis.buttons = getButton
  globalThis.commands = commands
  globalThis.menus = getMenus
  globalThis.modals = getModal
  globalThis.events = events
}
