import { type Awaitable, type ClientEvents } from 'discord.js'

interface EventProps<Event extends keyof ClientEvents> {
  name: Event
  once: boolean
  execute: (...args: ClientEvents[Event]) => Awaitable<void>
}
class BuildEvent<T extends keyof ClientEvents> {
  type: 'event' = 'event'
  name
  once
  execute

  constructor(props: EventProps<T>) {
    this.name = props.name
    this.once = props.once
    this.execute = props.execute
  }
}

export default BuildEvent

export type Event = InstanceType<typeof BuildEvent>
