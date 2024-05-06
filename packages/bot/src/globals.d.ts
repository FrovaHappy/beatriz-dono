/* eslint-disable no-var */
import type { Collection } from 'discord.js'
import type { CommandNames } from './const/CommandNames'
import type { Command } from './shared/BuildCommand'
import type { ButtonNames } from './const/ButtonNames'
import type { Button } from './shared/BuildButtons'
import { type MenuNames } from './const/MenuMames'
import { type Modal } from './core/build/BuildModal'
import { type ModalNames } from './const/ModalNames'
declare global {
  var commands: Collection<CommandNames | string, Command>
  var buttons: Collection<ButtonNames | string, Button>
  var menus: Collection<MenuNames | string, Menu>
  var modals: Collection<ModalNames | string, Modal>
  var cooldowns: Collection<string, Collection<string, number>>
}
