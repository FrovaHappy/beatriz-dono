// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Interaction, type PermissionResolvable } from 'discord.js'

export type Scope = 'public' | 'private' | 'owner'
export type Types = 'menus' | 'commands' | 'buttons'

export interface EventEmitted<Names, Interaction = any> {
  type: Types
  name: Names
  scope: Scope
  cooldown: number
  ephemeral: boolean
  permissions: PermissionResolvable[]
  execute: (e: Interaction, i18n: I18n) => Promise<InteractionEditReplyOptions>
}
