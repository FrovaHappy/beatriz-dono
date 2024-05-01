import type { Client, Collection, PermissionResolvable } from 'discord.js'
import { type CommandNames } from '../const/CommandNames'
import type { BaseFileButton, BaseFileCommand } from './BaseFiles'
import type { ButtonNames } from '../const/ButtonNames'

export interface ClientCustom extends Client {
  commands: Collection<CommandNames | string, BaseFileCommand>
  cooldowns: Collection<string, Collection<string, number>>
  buttons: Collection<keyof typeof ButtonsNames | string, BaseFileButton>
}
export type Scope = 'public' | 'private' | 'owner'
export interface BaseEventInteractionCreate {
  name: CommandNames | ButtonNames
  type: 'command' | 'button'
  scope: 'public' | 'private' | 'owner'
  cooldown?: number
  ephemeral: boolean
  permissions: PermissionResolvable[]
}
