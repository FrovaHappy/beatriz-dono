import getI18n, { type I18ns } from '@/shared/getI18n'
import formatterText from '@libs/formatterText'
import type { Locale } from 'discord.js'

interface I18n {
  title: string
  description: string
}
const i18ns: I18ns<I18n> = {
  'en-US': {
    title: 'Service not found!',
    description:
      'It seems that the service {{slot0}} was not found. This was probably caused by a change in the bot code.'
  },
  'es-ES': {
    title: 'Servicio no encontrado!',
    description:
      'Parece que el servicio {{slot0}} no se encuentra. Esto se debe a que se produjo un cambio en el código del bot.'
  }
}
export default function serviceNotFound(locale: Locale, service: string) {
  const i18n = getI18n(locale, i18ns)
  return {
    embeds: [
      {
        title: i18n.title,
        description: formatterText(i18n.description, { '{{slot0}}': service }),
        color: 16711680
      }
    ]
  }
}
