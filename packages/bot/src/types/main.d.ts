// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Interaction, type InteractionReplyOptions, type PermissionResolvable } from 'discord.js'

export type Scope = 'free' | 'premium' | 'dev'
export type Resolve = 'update' | 'defer'
export type Types = 'menus' | 'commands' | 'buttons' | 'modals'

export interface EventEmitted<Names, Interaction = any> {
  type: Types
  name: Names
  scope: Scope
  defer: boolean
  cooldown: number
  ephemeral: boolean
  permissions: PermissionResolvable[]
  execute: (e: Interaction) => Promise<InteractionEditReplyOptions>
}

export interface MessageOptions {
  content?: InteractionReplyOptions['content']
  embeds?: InteractionReplyOptions['embeds']
  components?: InteractionReplyOptions['components']
  files?: InteractionReplyOptions['files']
}
