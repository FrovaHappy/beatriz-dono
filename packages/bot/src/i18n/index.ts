// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// import ES from '../i18n/es.json'
// import EN from '../i18n/en.json'
import { Locale } from 'discord.js'
import type { I18n, I18nKeys } from './types'

import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const commandFolders = readdirSync(join(__dirname, './')).filter(f =>
  ['.ts', '.js', '.json'].every(e => !f.endsWith(e))
)

const commands = commandFolders.map(f => {
  const command = readdirSync(join(__dirname, f)).filter(f => f.endsWith('.json'))
  return { name: f, files: command }
})

const i18s = commands.map(c => {
  const i18n = c.files.map(f => {
    const lang = JSON.parse(readFileSync(join(__dirname, c.name, f)).toString())
    return { name: f.replace('.json', ''), lang }
  })
  return { name: c.name, i18n }
})

const rewriteProp = (objOriginal: any, objToReplace: any) => {
  Object.keys(objToReplace as object).forEach(key => {
    if (objOriginal[key] === undefined) return
    if (Array.isArray(objOriginal[key])) objOriginal[key] = [...objOriginal[key], ...objToReplace[key]]
    else if (typeof objOriginal[key] === 'object') objOriginal[key] = { ...objOriginal[key], ...objToReplace[key] }
    else objOriginal[key] = objToReplace[key]
  })
  return objOriginal
}

export function getI18n<T extends I18nKeys>(lang: Locale, key: T): I18n[T] {
  const i18n = i18s.find(i => i.name === key)?.i18n.find(i => i.name === lang)?.lang ?? {}

  const en = i18s.find(i => i.name === key)?.i18n.find(i => i.name === 'en-US')?.lang

  if (!en) throw new Error(`I18n not found for ${key} or en-US lang, generate it in i18n/${key}/en-US.json`)
  const d = { ...rewriteProp(en, i18n) }
  return d
}

export const general = (l: Locale) => getI18n<'general'>(l, 'general')

export function langs<T extends I18nKeys>(command: T) {
  return [Locale.EnglishUS, Locale.SpanishES].map(l => [l, getI18n(l, command)] as [Locale, I18n[T]])
}
