import { Timer } from '@/shared/general'
import { type ClientEvents, Collection } from 'discord.js'
import type BuildEvent from './build/BuildEvent'
import * as listImports from '@/listImports'
import logger from '@/shared/logger'

export default async function getEvents() {
  const time = new Timer()
  const events = new Collection<string, BuildEvent<keyof ClientEvents>>()
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
      files scanned: ${listImports.events.length}  
      finished in ${time.final()}
    `
  })
  return events
}
