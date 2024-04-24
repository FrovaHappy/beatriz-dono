import getI18n from '../../shared/i18n'
import messageFormatting from '../../shared/messageFormatting'
import { type CustomCommandInteraction } from '@/types/InteractionsCreate'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function welcome(i: CustomCommandInteraction) {
  const i18n = getI18n(i.locale)
  return {
    embeds: [
      {
        title: i18n.help.welcomeEmbed.title,
        description: messageFormatting(i18n.help.welcomeEmbed.description, {
          slot0: 'https://frovahappy.gitbook.io/beatriz-bot-docs/welcome-command',
          slot1: 'https://beatriz-bot-website.vercel.app/'
        }),
        color: 561481
      }
    ]
  }
}
