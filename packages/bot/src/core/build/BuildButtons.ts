import PERMISSIONS_BASE from '../../const/PermissionsBase'
import {
  type InteractionEditReplyOptions,
  type PermissionResolvable,
  type ButtonInteraction,
  type ButtonBuilder
} from 'discord.js'
import { type EventEmitted, type Scope } from '@/types/main'
import { type ButtonNames } from '@/const/interactionsNames'

interface ButtonsProps {
  name: ButtonNames
  scope?: Scope
  ephemeral?: boolean
  defer?: boolean
  permissions: PermissionResolvable[]
  cooldown?: number
  data: ButtonBuilder
  execute: (e: ButtonInteraction) => Promise<InteractionEditReplyOptions | undefined>
}
/**
 * #### Constructor
 * * ` data `: The buttonBuilder.customId(name) not is required.
 */
class BuildButton implements EventEmitted<string> {
  type: 'buttons' = 'buttons'
  name
  ephemeral
  permissions
  cooldown
  defer
  data
  scope
  execute
  constructor(props: Omit<ButtonsProps, 'type'>) {
    this.name = props.name
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? 0
    this.defer = props.defer ?? true
    this.ephemeral = props.ephemeral ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    this.data = props.data.setCustomId(this.name)
    this.execute = props.execute
  }
}
export type Button = InstanceType<typeof BuildButton>
export default BuildButton
