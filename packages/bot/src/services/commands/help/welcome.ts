import { type I18n } from '@/i18n'
import messageFormatting from '@/shared/messageFormatting'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function welcome(i18n: I18n) {
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
