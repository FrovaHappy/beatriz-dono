import { PermissionsBitField } from 'discord.js'
import type { BaseFileButton, BaseFileCommand } from './types/BaseFiles'
interface BuildCommandFile extends Omit<BaseFileCommand, 'type' | 'permissions' | 'ephemeral'> {
  permissions?: bigint
  ephemeral?: boolean
}
interface BuildButtonFile extends Omit<BaseFileButton, 'type' | 'scope' | 'permissions' | 'ephemeral'> {
  permissions?: bigint
  ephemeral?: boolean
}
const basePermissions =
  PermissionsBitField.Flags.SendMessages |
  PermissionsBitField.Flags.SendMessagesInThreads |
  PermissionsBitField.Flags.EmbedLinks |
  PermissionsBitField.Flags.UseExternalEmojis |
  PermissionsBitField.Flags.AttachFiles |
  PermissionsBitField.Flags.ReadMessageHistory
export function BuildCommand(options: BuildCommandFile): BaseFileCommand {
  const permissions = options.permissions ?? BigInt(0)
  return {
    data: options.data,
    name: options.name,
    scope: options.scope,
    cooldown: options.cooldown,
    ephemeral: options.ephemeral ?? false,
    permissions: basePermissions | permissions,
    type: 'command',
    execute: options.execute
  }
}
export function BuildButton(options: BuildButtonFile): BaseFileButton {
  const permissions = options.permissions ?? BigInt(0)
  return {
    data: options.data,
    execute: options.execute,
    name: options.name,
    ephemeral: options.ephemeral ?? false,
    type: 'button',
    scope: 'public',
    permissions: basePermissions | permissions,
    cooldown: options.cooldown
  }
}
