import { Locale } from 'discord.js'

function rewriteObjet<T>(original: any, remplace: any): T {
  const newObjet = original
  if (!remplace) return newObjet
  const keys = (() => {
    try {
      if (Array.isArray(newObjet)) return
      if (typeof newObjet === 'string') return
      return Object.keys(newObjet)
    } catch (e) {
      return
    }
  })()
  if (!keys) return remplace
  for (const key of keys) {
    newObjet[key] = rewriteObjet(newObjet[key], remplace[key])
  }
  return newObjet
}
export type I18ns<T> = Partial<Record<Locale, T>>

export default function getI18n<T>(langue: Locale, i18ns: I18ns<T>) {
  let lang = langue
  if (lang === Locale.SpanishLATAM) lang = Locale.SpanishES

  const i18n = i18ns[lang] ?? (i18ns['en-US'] as T)
  const en = i18ns['en-US']

  if (!en) throw new Error('is required en-US lang')

  return rewriteObjet<T>(en, i18n)
}
