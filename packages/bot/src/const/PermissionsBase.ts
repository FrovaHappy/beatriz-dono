import type { PermissionResolvable } from 'discord.js'

export const PERMISSIONS_BASE_BOT: PermissionResolvable[] = [
  'SendMessages',
  'SendMessagesInThreads',
  'EmbedLinks',
  'UseExternalEmojis',
  'AttachFiles',
  'ReadMessageHistory'
]
export const PERMISSIONS_BASE_USER: PermissionResolvable[] = ['SendMessages', 'ReadMessageHistory']

