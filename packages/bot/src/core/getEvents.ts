import path from 'node:path'
import { readAllFiles, Timer } from '@/shared/general'
import { type ClientEvents, Collection } from 'discord.js'
import type BuildEvent from './build/BuildEvent'
import * as listImports from '@/listImports'
import logger from '@/shared/logger'

const includes = ['.ts', '.js']
const excludes = ['.test.ts', '.d.ts', '.test.js']

export default async function getEvents() {
  const time = new Timer()
  const events = new Collection<string, BuildEvent<keyof ClientEvents>>()
  const absolutePath = path.join(config.env.rootPath, 'events')
  const eventsPath = (await readAllFiles(absolutePath)).filter(
    file => includes.some(include => file.endsWith(include)) && !excludes.some(exclude => file.endsWith(exclude))
  )
  for (const event of Object.entries(listImports.events)) {
    const [, instance] = event
    events.set(instance.name, instance)
  }
  logger({
    type: 'info',
    head: 'Events',
    title: 'Loading events',
    body: `
      events found: ${events.size}  
      files scanned: ${eventsPath.length}  
      finished in ${time.final()}
    `
  })
  return events
}
