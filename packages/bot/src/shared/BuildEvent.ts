import { type Client, type Events } from 'discord.js'

interface EventProps {
  name: Events
  once: boolean
  execute: (client: Client) => void
}
class BuildEvent {
  name
  once
  execute

  constructor(props: EventProps) {
    this.name = props.name
    this.once = props.once
    this.execute = props.execute
  }
}

export type Event = InstanceType<typeof BuildEvent>
