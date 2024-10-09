import { getI18n } from '@/i18n'
import formatterText from '@libs/formatterText.js'
import { Colors, EmbedBuilder, type Locale } from 'discord.js'

export default function messageHasOcurredAnError(locale: Locale, trigger: string) {
  const i18n = getI18n(locale, 'general')
  return {
    embeds: [
      new EmbedBuilder({
        title: i18n.hasOcurredAnError.title,
        description: i18n.hasOcurredAnError.description,
        color: Colors.Red,
        footer: { text: formatterText(i18n.hasOcurredAnError.footer, { slot0: trigger }) }
      })
    ]
  }
}
