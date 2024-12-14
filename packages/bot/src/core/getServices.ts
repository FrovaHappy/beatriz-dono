import path from 'node:path'
import readAllFiles from '@/shared/readAllFiles'
import { Collection } from 'discord.js'
import p from 'picocolors'
import BuildButton from './build/BuildButtons'
import BuildCommand from './build/BuildCommand'
import BuildMenu from './build/BuildMenu'
import BuildModal from './build/BuildModal'
import Collections from '@/shared/Collections'

globalThis.buttons = new Collection<string, BuildButton>()
globalThis.commands = new Collection<string, BuildCommand>()
globalThis.menus = new Collection<string, BuildMenu<'string'>>()
globalThis.modals = new Collection<string, BuildModal>()

const includes = ['.ts', '.js']
const excludes = ['.test.ts', '.d.ts', '.test.js']
export default async function getServices() {
  console.log(`${p.green('[services]')} Loading services`)
  const absolutePath = path.join(config.rootPath, 'services')
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
    if (service instanceof BuildButton) globalThis.buttons.set(service.name, service)
    if (service instanceof BuildCommand) globalThis.commands.set(service.name, service)
    if (service instanceof BuildMenu) globalThis.menus.set(service.name, service)
    if (service instanceof BuildModal) globalThis.modals.set(service.name, service)
  }
  const logs = [
    `${p.green('[services]')} Done:`,
    `  ∷ buttons found: ${p.bold(globalThis.buttons.size)}`,
    `  ∷ commands found: ${p.bold(globalThis.commands.size)}`,
    `  ∷ menus found: ${p.bold(globalThis.menus.size)}`,
    `  ∷ modals found: ${p.bold(globalThis.modals.size)}`,
    `  ∷ files scanned: ${p.bold(servicesPath.length)}\n`
  ]
  console.log(logs.join('\n'))
}
