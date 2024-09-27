import type { Locale } from 'discord.js'
import type { I18n } from './types'

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const commandFolders = readdirSync(join(__dirname, './')).filter(f =>
  ['.ts', '.js', '.json'].every(e => !f.endsWith(e))
)

function rewriteProp<T>(objO: T, objToReplace: Record<string, any> | undefined): T {
  const objOriginal = objO as Record<string, any>
  if (!objToReplace) return objOriginal as T
  for (const key in Object.keys(objToReplace)) {
    if (objOriginal[key] === undefined) continue
    if (Array.isArray(objOriginal[key])) objOriginal[key] = [...objOriginal[key], ...objToReplace[key]]
    else if (typeof objOriginal[key] === 'object') objOriginal[key] = { ...objOriginal[key], ...objToReplace[key] }
    else objOriginal[key] = objToReplace[key]
  }
  return objOriginal as T
}

export function getI18n<T extends keyof I18n>(lang: Locale, key: T, strict = true) {
  const i18nPath = join(__dirname, key, `${lang}.json`)
  const enPath = join(__dirname, key, 'en-US.json')

  const i18n: I18n[T] | undefined = existsSync(i18nPath) ? JSON.parse(readFileSync(i18nPath, 'utf-8')) : undefined
  const en: I18n[T] | undefined = existsSync(enPath) ? JSON.parse(readFileSync(enPath, 'utf-8')) : undefined

  if (!en) throw new Error(`file i18n/${key}/${lang}.json is required`)

  return rewriteProp(en, i18n)
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
