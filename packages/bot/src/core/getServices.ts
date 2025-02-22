import path from 'node:path'
import readAllFiles from '@/shared/readAllFiles'
import { ButtonStyle, Collection } from 'discord.js'
import p from 'picocolors'
import BuildButton from './build/BuildButtons'
import BuildCommand from './build/BuildCommand'
import BuildMenu, { type SelectMenu } from './build/BuildMenu'
import BuildModal from './build/BuildModal'

const buttons = new Collection<string, BuildButton>()
const commands = new Collection<string, BuildCommand>()
const menus = new Collection<string, BuildMenu<'string'>>()
const modals = new Collection<string, BuildModal>()

function getMenus<T extends keyof SelectMenu = 'string'>(key: string, safe = false): BuildMenu<T> {
  const menu = menus.get(key)
  if (!menu && safe)
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
      execute: async e => undefined
    })
  if (!menu) throw new Error(`Menu ${key} not found`)
  return menu as any
}

function getButton(key: string, safe = false): BuildButton {
  const button = buttons.get(key)
  if (!button && safe)
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
      execute: async e => undefined
    })
  if (!button) throw new Error(`Button ${key} not found`)
  return button as any
}

export type GetMenu = typeof getMenus
export type GetButton = typeof getButton

globalThis.buttons = getButton
globalThis.commands = commands
globalThis.menus = getMenus
globalThis.modals = modals

const includes = ['.ts', '.js']
const excludes = ['.test.ts', '.d.ts', '.test.js']
export default async function getServices() {
  console.log(`${p.green('[services]')} Loading services`)
  const absolutePath = path.join(config.env.rootPath, 'services')
  const servicesPath = (await readAllFiles(absolutePath)).filter(
    file => includes.some(include => file.endsWith(include)) && !excludes.some(exclude => file.endsWith(exclude))
  )

  for (const servicePath of servicesPath) {
    const service = (() => {
      try {
        return require(servicePath).default
      } catch (error) {
        console.log(`${p.red('[services]')} Error loading service ${servicePath}\n${error}`)
        return null
      }
    })()
    if (service instanceof BuildButton) {
      const existButton = !!buttons.get(service.customId)
      if (existButton) throw new Error(`Button ${service.customId} already exists`)
      buttons.set(service.customId, service)
    }
    if (service instanceof BuildCommand) globalThis.commands.set(service.name, service)
    if (service instanceof BuildMenu) {
      const existMenu = !!menus.get(service.customId)
      if (existMenu) throw new Error(`Menu ${service.customId} already exists`)
      menus.set(service.customId, service)
    }
    if (service instanceof BuildModal) globalThis.modals.set(service.name, service)
  }
  const logs = [
    `${p.green('[services]')} Done:`,
    `  ∷ buttons found: ${p.bold(buttons.size)}`,
    `  ∷ commands found: ${p.bold(globalThis.commands.size)}`,
    `  ∷ menus found: ${p.bold(menus.size)}`,
    `  ∷ modals found: ${p.bold(globalThis.modals.size)}`,
    `  ∷ files scanned: ${p.bold(servicesPath.length)}\n`
  ]
  console.log(logs.join('\n'))
}
