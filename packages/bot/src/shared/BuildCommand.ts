import { type CustomCommandInteraction } from '@/types/InteractionsCreate'
import { type BaseEventInteractionCreate } from '@/types/main'
import { type SlashCommandBuilder, type InteractionEditReplyOptions, type PermissionResolvable } from 'discord.js'

interface CommandProps extends BaseEventInteractionCreate {
  permissions: PermissionResolvable[]
  execute: (e: CustomCommandInteraction) => Promise<InteractionEditReplyOptions>
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
  ephemeral = false
  permissions = ['AddReactions', 'BanMembers'] as PermissionResolvable[]
  cooldown
  data
  execute
  constructor(props: Omit<CommandProps, 'type'>) {
    this.name = props.name
    this.scope = props.scope
    this.cooldown = props.cooldown ?? 0
    this.ephemeral = props.ephemeral
    this.permissions = [...new Set([this.permissions, ...props.permissions])]
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.data = !props.data.name ? props.data.setName!(this.name) : props.data
    this.execute = props.execute
  }

  static className = 'BuildCommand'
}

export default BuildCommand
