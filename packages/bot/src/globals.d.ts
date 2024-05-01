/* eslint-disable no-var */
import type { Collection } from 'discord.js'
import type { CommandNames } from './const/CommandNames'
import type { Command } from './shared/BuildCommand'
import type { ButtonNames } from './const/ButtonNames'
import type { Button } from './shared/BuildButtons'
declare global {
  var commands: Collection<CommandNames | string, Command>
  var buttons: Collection<ButtonNames | string, Button>
  var cooldowns: Collection<string, Collection<string, number>>
}
