import { CommandNames } from '@/const/interactionsNames'
import { getI18n } from '@/i18n'
import formatterText from '@lib/formatterText'
import type { Locale } from 'discord.js'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function welcome(l: Locale) {
  const i18n = getI18n(l, CommandNames.help)
  return {
    embeds: [
      {
        title: i18n.welcomeEmbed.title,
        description: formatterText(i18n.welcomeEmbed.description, {
          slot0: 'https://frovahappy.gitbook.io/beatriz-bot-docs/welcome-command',
          slot1: 'https://beatriz-bot-website.vercel.app/'
        }),
        color: 561481
      }
    ]
  }
}
