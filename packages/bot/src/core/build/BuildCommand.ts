import PERMISSIONS_BASE from '../../const/PermissionsBase'
import { type EventEmitted, type Scope } from '@/types/main'
import type {
  SlashCommandBuilder,
  InteractionEditReplyOptions,
  PermissionResolvable,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder
} from 'discord.js'

import { type CommandNames } from '@/const/interactionsNames'

interface CommandProps {
  name: CommandNames
  scope?: Scope
  cooldown?: number
  ephemeral?: boolean
  defer?: boolean
  permissions: PermissionResolvable[]
  execute: (e: ChatInputCommandInteraction) => Promise<InteractionEditReplyOptions | undefined>
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
}
/**
 * #### Constructor
 * * ` data `: The SlashCommandBuilder.setName(name) is Optional
 */
class BuildCommand implements EventEmitted<string> {
  type: 'commands' = 'commands'
  name
  scope
  defer
  ephemeral
  permissions
  cooldown
  data
  execute
  constructor(props: CommandProps) {
    this.name = props.name
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? 0
    this.defer = props.defer ?? true
    this.ephemeral = props.ephemeral ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.data = props.data.setName(this.name)
    this.execute = props.execute
  }
}

export type Command = InstanceType<typeof BuildCommand>
export default BuildCommand
