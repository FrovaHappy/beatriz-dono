import PERMISSIONS_BASE from '../../const/PermissionsBase'
import {
  type InteractionEditReplyOptions,
  type PermissionResolvable,
  type StringSelectMenuBuilder,
  type UserSelectMenuBuilder,
  type RoleSelectMenuBuilder,
  type MentionableSelectMenuBuilder,
  type ChannelSelectMenuBuilder,
  type StringSelectMenuInteraction,
  type UserSelectMenuInteraction,
  type RoleSelectMenuInteraction,
  type MentionableSelectMenuInteraction,
  type ChannelSelectMenuInteraction
} from 'discord.js'
import { type I18n } from '../../i18n'
import { MENU_NAME, type MenuNames } from '@/const/MenuMames'
import { type EventEmitted, type Scope } from '@/types/main'
interface Types {
  string: {
    builder: StringSelectMenuBuilder
    interaction: StringSelectMenuInteraction
  }
  user: {
    builder: UserSelectMenuBuilder
    interaction: UserSelectMenuInteraction
  }
  role: {
    builder: RoleSelectMenuBuilder
    interaction: RoleSelectMenuInteraction
  }
  mentionable: {
    builder: MentionableSelectMenuBuilder
    interaction: MentionableSelectMenuInteraction
  }
  channels: {
    builder: ChannelSelectMenuBuilder
    interaction: ChannelSelectMenuInteraction
  }
}

type MenuType = keyof Types
interface MenuProps<T extends MenuType> {
  menuType: T
  name: MenuNames
  scope?: Scope
  ephemeral?: boolean
  permissions: PermissionResolvable[]
  cooldown?: number
  data: Types[T]['builder']
  execute: (e: Types[T]['interaction'], i18n: I18n) => Promise<InteractionEditReplyOptions>
}
/**
 * #### Constructor
 * * ` data `: The buttonBuilder.customId(name) not is required.
 */
class BuildMenu<T extends MenuType> implements EventEmitted<string> {
  type: 'menus' = 'menus'
  name
  ephemeral
  permissions
  cooldown
  data
  scope
  menuType: MenuType
  execute
  constructor(props: MenuProps<T>) {
    this.name = MENU_NAME[props.name]
    this.scope = props.scope ?? 'owner'
    this.menuType = props.menuType
    this.cooldown = props.cooldown ?? 0
    this.ephemeral = props.ephemeral ?? false
    this.permissions = [...new Set([...PERMISSIONS_BASE, ...props.permissions])]
    this.data = props.data.setCustomId(this.name)
    this.execute = props.execute
  }
}
export type Menu = InstanceType<typeof BuildMenu>
export default BuildMenu
