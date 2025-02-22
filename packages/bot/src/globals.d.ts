/* eslint-disable no-var */
import type { Collection } from 'discord.js'
import type { ButtonNames, CommandNames, MenuNames, ModalNames } from './const/interactionsNames'
import type { Config } from './config'
import type { Button } from './shared/BuildButtons'
import type { Command } from './shared/BuildCommand'
import type { JsonResponse } from './api/types'
import type { GetButton, GetMenu } from './core/getServices'
declare global {
  var commands: Collection<CommandNames | string, Command>
  var buttons: GetButton
  var menus: GetMenu
  var modals: Collection<ModalNames | string, Modal>
  var cooldowns: Collection<string, Collection<string, number>>
  var config: Config
}

declare module 'express' {
  interface Response {
    json(data: JsonResponse): void
  }
}
