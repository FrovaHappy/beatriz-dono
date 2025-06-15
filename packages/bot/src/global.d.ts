import type { ClientEvents, Collection } from 'discord.js'
import type { JsonResponse } from './api/types'
import type { Config } from './config'
import type { ButtonNames, CommandNames, MenuNames, ModalNames } from './const/interactionsNames'
import type { GetButton, GetMenu, GetModal } from './core/getServices'
import type { Button } from './shared/BuildButtons'
import type { Command } from './shared/BuildCommand'
import type BuildEvent from './core/build/BuildEvent'

declare global {
  var commands: Record<CommandNames | string, Command>
  var buttons: GetButton
  var menus: GetMenu
  var modals: GetModal
  var cooldowns: Collection<string, Collection<string, number>>
  var events: Record<string, BuildEvent<keyof ClientEvents>>
  var config: Config
}

declare module 'express' {
  interface Response {
    json(data: JsonResponse): void
  }
}
