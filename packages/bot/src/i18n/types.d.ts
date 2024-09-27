import type { CommandNames } from '@/const/interactionsNames'

import type aboutMe from './about-me/en-US.json'
import type colors from './colors/en-US.json'
import type general from './general/en-US.json'
import type help from './help/en-US.json'
import type setWelcome from './welcome-set/en-US.json'

export interface I18n {
  general: typeof general
  [CommandNames.colors]: typeof colors
  [CommandNames.aboutMe]: typeof aboutMe
  [CommandNames.welcomeSet]: typeof setWelcome
  [CommandNames.help]: typeof help
}

export type I18nKeys = keyof I18n
