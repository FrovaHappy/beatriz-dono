import { getI18n } from '@/i18n'
import formatterText from '@lib/formatterText'
import { Colors, EmbedBuilder, type Locale } from 'discord.js'

export default function messageErrorFoundService(locale: Locale, service: string) {
  const i18n = getI18n(locale, 'general')
  return {
    embeds: [
      new EmbedBuilder({
        title: i18n.errorFoundService.title,
        description: formatterText(i18n.errorFoundService.description, { slot0: service }),
        color: Colors.Orange
      })
    ]
  }
}
