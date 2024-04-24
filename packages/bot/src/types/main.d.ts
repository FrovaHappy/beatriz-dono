import type { Client, Collection, BitFieldResolvable } from 'discord.js'
import type { BaseFileButton, BaseFileCommand } from './BaseFiles'
import type { ButtonsNames, CommandsNames } from '../enums'

export interface ClientCustom extends Client {
  commands: Collection<keyof typeof CommandsNames | string, BaseFileCommand>
  cooldowns: Collection<string, Collection<string, number>>
  buttons: Collection<keyof typeof ButtonsNames | string, BaseFileButton>
}
export type OmitScopeOfBaseEventInteraction = Omit<BaseEventInteractionCreate, 'scope'>
export interface BaseEventInteractionCreate {
  name: CommandsNames | ButtonsNames
  type: 'command' | 'button'
  scope: 'public' | 'private' | 'owner'
  cooldown?: number
  ephemeral: boolean
  permissions: BitFieldResolvable
}
