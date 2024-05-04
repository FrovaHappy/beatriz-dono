import { objWithKeyValueEqual } from '../shared/general'

export const MENU_NAME = {
  test: 'button-test'
} satisfies Record<string, string>

export type MenuNames = keyof typeof MENU_NAME

export const MenuNamesKeys = objWithKeyValueEqual<MenuNames>(MENU_NAME)
