import type { CommandNames } from '@/const/interactionsNames'

import type aboutMe from './about-me/en-US.json'
import type colors from './colors/en-US.json'
import type general from './general/en-US.json'
import type help from './help/en-US.json'
import type setWelcome from './welcome-set/en-US.json'

export const I18nd = {
  general,
  [CommandNames.colors]: colors,
  [CommandNames.aboutMe]: aboutMe,
  [CommandNames.welcomeSet]: setWelcome,
  [CommandNames.help]: help
}

export type I18nKeys = keyof typeof I18nd

export type I18n = typeof I18nd
