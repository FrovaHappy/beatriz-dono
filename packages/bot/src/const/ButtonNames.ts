import { objWithKeyValueEqual } from '../shared/general'

export const BUTTON_NAME = {
  test: 'button-test'
} satisfies Record<string, string>

export type ButtonNames = keyof typeof BUTTON_NAME

export const ButtonNamesKeys = objWithKeyValueEqual<ButtonNames>(BUTTON_NAME)
