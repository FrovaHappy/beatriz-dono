import ES from '../i18n/es.json'
import EN from '../i18n/en.json'

const languages: Record<string, typeof EN> = {
  en: EN,
  es: { ...EN, ...ES }
}
export const es = languages.es
export const en = languages.en

export default function getI18n(lang: string): typeof EN {
  lang = lang.slice(0, 2)
  return languages[lang] ?? languages.en
}
