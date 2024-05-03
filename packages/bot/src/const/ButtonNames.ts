import { objWithKeyValueEqual } from '../shared/general'

export const BUTTON_NAME = {
  test: 'button-test'
} satisfies Record<string, string>

export type ButtonName = keyof typeof BUTTON_NAME

export const ButtonNamesKeys = objWithKeyValueEqual<ButtonName>(BUTTON_NAME)
