import { Locale } from 'discord.js'
import type { I18n } from './types'

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const commandFolders = readdirSync(join(__dirname, './')).filter(f =>
  ['.ts', '.js', '.json'].every(e => !f.endsWith(e))
)

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

export function getI18n<T extends keyof I18n>(langues: Locale, key: T, strict = true) {
  let lang = langues
  if (lang === Locale.SpanishLATAM) lang = Locale.SpanishES
  const i18nPath = join(__dirname, key, `${lang}.json`)
  const enPath = join(__dirname, key, 'en-US.json')

  const i18n: I18n[T] | undefined = existsSync(i18nPath) ? JSON.parse(readFileSync(i18nPath, 'utf-8')) : undefined
  const en: I18n[T] | undefined = existsSync(enPath) ? JSON.parse(readFileSync(enPath, 'utf-8')) : undefined

  if (!en) throw new Error(`file i18n/${key}/${lang}.json is required`)

  return rewriteObjet<typeof en>(en, i18n)
}

export const getI18nCollection = <T extends keyof I18n>(name: T) => {
  const path = join(__dirname, name)
  if (!existsSync(path)) return []
  const result: Array<[Locale, I18n[T]]> = []
  const langs = readdirSync(path)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', '')) as Locale[]
  for (const lang of langs) {
    result.push([lang, getI18n(lang, name)])
  }
  return result
}
