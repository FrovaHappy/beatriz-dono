import ES from '../i18n/es.json'
import EN from '../i18n/en.json'
import { type Locale } from 'discord.js'

export type I18n = typeof EN

const languages: Partial<Record<Locale, I18n>> = {
  'en-US': EN,
  'es-ES': { ...EN, ...ES }
}
export const es = languages['es-ES']
export const en = EN

export default function getI18n(lang: Locale): I18n {
  return languages[lang] ?? EN
}
