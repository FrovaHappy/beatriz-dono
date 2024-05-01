import { type ButtonNames } from '@/const/ButtonNames'
import PERMISSIONS_BASE from '@/const/PermissionsBase'
import {
  type InteractionEditReplyOptions,
  type PermissionResolvable,
  type ButtonInteraction,
  type ButtonBuilder
} from 'discord.js'

interface ButtonsProps {
  type: 'button'
  name: ButtonNames
  ephemeral?: boolean
  permissions: PermissionResolvable[]
  cooldown?: number
  data: ButtonBuilder
  execute: (e: ButtonInteraction) => Promise<InteractionEditReplyOptions>
}
/**
 * #### Constructor
 * * ` data `: The buttonBuilder.customId(name) not is required.
 */
class BuildButton {
  type: 'button' = 'button'
  name
  ephemeral
  permissions
  cooldown
  data
  execute
  constructor(props: Omit<ButtonsProps, 'type'>) {
    this.name = props.name
    this.cooldown = props.cooldown ?? 0
    this.ephemeral = props.ephemeral ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    this.data = props.data.setCustomId(this.name)
    this.execute = props.execute
  }

  static className = 'BuildButton'
}
export type Button = InstanceType<typeof BuildButton>
export default BuildButton
