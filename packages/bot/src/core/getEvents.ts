import path from 'node:path'
import { readAllFiles } from '@/shared/general'
import { type ClientEvents, Collection } from 'discord.js'
import p from 'picocolors'
import type BuildEvent from './build/BuildEvent'
import * as listImports from '@/listImports'

const includes = ['.ts', '.js']
const excludes = ['.test.ts', '.d.ts', '.test.js']

export default async function getEvents() {
  console.log(`${p.green('[events]:')} Loading events`)
  const events = new Collection<string, BuildEvent<keyof ClientEvents>>()
  const absolutePath = path.join(config.env.rootPath, 'events')
  const eventsPath = (await readAllFiles(absolutePath)).filter(
    file => includes.some(include => file.endsWith(include)) && !excludes.some(exclude => file.endsWith(exclude))
  )
  for (const event of Object.entries(listImports.events)) {
    const [, instance] = event
    events.set(instance.name, instance)
  }
  const logs = [
    `${p.green('[events]')} Done:`,
    `  ∷ event found: ${p.bold(events.size)}`,
    `  ∷ files scanned: ${p.bold(eventsPath.length)}`
  ]
  console.log(logs.join('\n'))
  return events
}
