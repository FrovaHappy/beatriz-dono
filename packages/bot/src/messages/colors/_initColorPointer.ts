import { ButtonNames } from '@/const/interactionsNames'
import getI18n, { type I18ns } from '@/shared/getI18n'
import { ActionRowBuilder, Colors, type Locale } from 'discord.js'

interface I18n {
  title: string
  description: string
}

const i18ns: I18ns<I18n> = {
  'en-US': {
    title: 'Module not configured',
    description: 'The module is not configured. Please, start the configuration process.'
  },
  'es-ES': {
    title: 'El Modulo no esta configurado',
    description: 'Para poder usar este modulo, por favor, inicia el proceso de configuración.'
  }
}

export default function initColorPointer(locale: Locale) {
  const i18n = getI18n(locale, i18ns)
  return {
    embeds: [
      {
        title: i18n.title,
        description: i18n.description,
        color: Colors.Red
      }
    ],
    components: [new ActionRowBuilder().addComponents(buttons.get(ButtonNames.startColor).data)]
  }
}
