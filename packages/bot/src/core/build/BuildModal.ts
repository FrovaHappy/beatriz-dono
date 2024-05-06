import PERMISSIONS_BASE from '../../const/PermissionsBase'
import {
  type InteractionEditReplyOptions,
  type PermissionResolvable,
  type ModalSubmitInteraction,
  type ModalBuilder
} from 'discord.js'
import { type I18n } from '../../i18n'
import { type EventEmitted, type Scope } from '@/types/main'
import { type ModalNames } from '@/const/interactionsNames'

interface ModalsProps {
  name: ModalNames
  scope?: Scope
  ephemeral?: boolean
  defer?: boolean
  permissions: PermissionResolvable[]
  cooldown?: number
  data: ModalBuilder
  execute: (e: ModalSubmitInteraction, i18n: I18n) => Promise<InteractionEditReplyOptions | undefined>
}
/**
 * #### Constructor
 * * ` data `: The modalBuilder.customId(name) not is required.
 */
class BuildModal implements EventEmitted<string> {
  type: 'modals' = 'modals'
  name: string
  ephemeral
  permissions
  cooldown
  defer
  data
  scope
  execute
  constructor(props: ModalsProps) {
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
export type Modal = InstanceType<typeof BuildModal>
export default BuildModal
