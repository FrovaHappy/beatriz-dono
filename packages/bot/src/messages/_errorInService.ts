import formatterText from '@libs/formatterText'
import { Colors, EmbedBuilder, type Locale } from 'discord.js'

interface I18n {
  title: string
  description: string
}

const i18ns: Partial<Record<Locale, I18n>> = {
  'en-US': {
    title: '❌ Error Found!',
    description: 'Something went wrong with the service {{slot0}}'
  },
  'es-ES': {
    title: '❌ ¡Error encontrado!',
    description: 'Algo salió mal con el servicio {{slot0}}'
  }
}

export default function errorInService(locale: Locale, service: string) {
  const i18n = i18ns[locale] ?? (i18ns['en-US'] as I18n)
  return {
    embeds: [
      new EmbedBuilder({
        title: i18n.title,
        description: formatterText(i18n.description, { '{{slot0}}': service }),
        color: Colors.Orange
      })
    ]
  }
}
