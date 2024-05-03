import { objWithKeyValueEqual } from '../shared/general'

export const COMMAND_NAME = {
  test: 'test',
  welcomeSet: 'set-welcome',
  aboutMe: 'about-me',
  ping: 'ping',
  colors: 'colors',
  colorsSet: 'set-colors',
  colorsList: 'colors-list',
  colorsOrder: 'colors-order',
  colorsRemove: 'colors-remove',
  help: 'help'
} satisfies Record<string, string>

export type CommandNames = keyof typeof COMMAND_NAME

export const CommandNamesKeys = objWithKeyValueEqual<CommandNames>(COMMAND_NAME)
