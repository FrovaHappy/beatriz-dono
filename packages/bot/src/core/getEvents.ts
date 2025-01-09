import path from 'node:path'
import readAllFiles from '@/shared/readAllFiles'
import { type ClientEvents, Collection } from 'discord.js'
import p from 'picocolors'
import BuildEvent from './build/BuildEvent'

const includes = ['.ts', '.js']
const excludes = ['.test.ts', '.d.ts', '.test.js']

export default async function getEvents() {
  console.log(`${p.green('[events]:')} Loading events`)
  const events = new Collection<string, BuildEvent<keyof ClientEvents>>()
  const absolutePath = path.join(config.env.rootPath, 'events')
  const eventsPath = (await readAllFiles(absolutePath)).filter(
    file => includes.some(include => file.endsWith(include)) && !excludes.some(exclude => file.endsWith(exclude))
  )
  for (const eventPath of eventsPath) {
    const event = (() => {
      try {
        return require(eventPath).default
      } catch (error) {
        console.error(error)
        console.log(`${p.red('[events]:')} Error loading event ${eventPath}`)
        return null
      }
    })()
    if (event instanceof BuildEvent) events.set(event.name, event)
  }
  const logs = [
    `${p.green('[events]')} Done:`,
    `  ∷ event found: ${p.bold(events.size)}`,
    `  ∷ files scanned: ${p.bold(eventsPath.length)}`
  ]
  console.log(logs.join('\n'))
  return events
}
