import getI18n, { type I18ns } from '@/shared/getI18n'
import formatterText from '@libs/formatterText'
import { Colors, type Locale } from 'discord.js'

interface I18n {
  title: string
  description: string
  footer: string
}

const i18ns: I18ns<I18n> = {
  'en-US': {
    title: 'Color is incorrect',
    description: 'The color `{{slot0}}` is incorrect',
    footer: 'the format is #RRGGBB'
  },
  'es-ES': {
    title: 'El color no es correcto',
    description: 'El color `{{slot0}}` no es correcto',
    footer: 'el formato es #RRGGBB'
  }
}

export default function colorIncorrect(locale: Locale, color: string) {
  const i18n = getI18n(locale, i18ns)
  return {
    embeds: [
      {
        title: i18n.title,
        description: formatterText(i18n.description, { '{{slot0}}': color }),
        color: Colors.Red,
        footer: { text: i18n.footer }
      }
    ]
  }
}
