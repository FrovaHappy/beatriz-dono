import { objWithKeyValueEqual } from '../shared/general'

export const MODAL_NAME = {
  test: 'modal-test'
} satisfies Record<string, string>

export type ModalNames = keyof typeof MODAL_NAME

export const ModalNamesKeys = objWithKeyValueEqual<ModalNames>(MODAL_NAME)
