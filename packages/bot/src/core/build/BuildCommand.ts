import { COMMAND_NAME, type CommandNames } from '../../const/CommandNames'
import PERMISSIONS_BASE from '../../const/PermissionsBase'
import { type EventEmitted, type Scope } from '@/types/main'
import type {
  SlashCommandBuilder,
  InteractionEditReplyOptions,
  PermissionResolvable,
  ChatInputCommandInteraction
} from 'discord.js'

import { type I18n } from '../../i18n'

interface CommandProps {
  name: CommandNames
  scope?: Scope
  cooldown?: number
  ephemeral?: boolean
  permissions: PermissionResolvable[]
  execute: (e: ChatInputCommandInteraction, i18n: I18n) => Promise<InteractionEditReplyOptions>
  data: Partial<SlashCommandBuilder>
}
/**
 * #### Constructor
 * * ` data `: The SlashCommandBuilder.setName(name) is Optional
 */
class BuildCommand implements EventEmitted<string> {
  type: 'commands' = 'commands'
  name: string
  scope
  ephemeral
  permissions
  cooldown
  data
  execute
  constructor(props: CommandProps) {
    this.name = COMMAND_NAME[props.name]
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? 0
    this.ephemeral = props.ephemeral ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.data = props.data.setName!(this.name)
    this.execute = props.execute
  }
}

export type Command = InstanceType<typeof BuildCommand>
export default BuildCommand
