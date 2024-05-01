import { type CommandNames } from '@/const/CommandNames'
import PERMISSIONS_BASE from '../const/PermissionsBase'
import { type Scope } from '@/types/main'
import type {
  SlashCommandBuilder,
  InteractionEditReplyOptions,
  PermissionResolvable,
  ChatInputCommandInteraction
} from 'discord.js'

interface CommandProps {
  name: CommandNames
  scope: Scope
  cooldown?: number
  ephemeral?: boolean
  permissions: PermissionResolvable[]
  execute: (e: ChatInputCommandInteraction) => Promise<InteractionEditReplyOptions>
  data: Partial<SlashCommandBuilder>
}
/**
 * #### Constructor
 * * ` data `: The SlashCommandBuilder.setName(name) is Optional
 */
class BuildCommand implements CommandProps {
  type: 'command' = 'command'
  name
  scope
  ephemeral
  permissions
  cooldown
  data
  execute
  constructor(props: CommandProps) {
    this.name = props.name
    this.scope = props.scope
    this.cooldown = props.cooldown ?? 0
    this.ephemeral = props.ephemeral ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.data = props.data.setName!(this.name)
    this.execute = props.execute
  }

  static className = 'BuildCommand'
}

export type Command = InstanceType<typeof BuildCommand>
export default BuildCommand
