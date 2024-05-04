import { BUTTON_NAME, type ButtonName } from '../../const/ButtonNames'
import PERMISSIONS_BASE from '../../const/PermissionsBase'
import {
  type InteractionEditReplyOptions,
  type PermissionResolvable,
  type ButtonInteraction,
  type ButtonBuilder
} from 'discord.js'
import { type I18n } from '../../i18n'
import { type Scope } from '@/types/main'

interface ButtonsProps {
  name: ButtonName
  scope?: Scope
  ephemeral?: boolean
  permissions: PermissionResolvable[]
  cooldown?: number
  data: ButtonBuilder
  execute: (e: ButtonInteraction, i18n: I18n) => Promise<InteractionEditReplyOptions>
}
/**
 * #### Constructor
 * * ` data `: The buttonBuilder.customId(name) not is required.
 */
class BuildButton {
  type: 'button' = 'button'
  name: string
  ephemeral
  permissions
  cooldown
  data
  scope
  execute
  constructor(props: Omit<ButtonsProps, 'type'>) {
    this.name = BUTTON_NAME[props.name]
    this.scope = props.scope ?? 'owner'
    this.cooldown = props.cooldown ?? 0
    this.ephemeral = props.ephemeral ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    this.data = props.data.setCustomId(this.name)
    this.execute = props.execute
  }
}
export type Button = InstanceType<typeof BuildButton>
export default BuildButton
