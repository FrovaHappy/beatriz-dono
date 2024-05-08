import { type I18n } from '@/i18n'
import formatterText from '@lib/formatterText'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function welcome(i18n: I18n) {
  return {
    embeds: [
      {
        title: i18n.help.welcomeEmbed.title,
        description: formatterText(i18n.help.welcomeEmbed.description, {
          slot0: 'https://frovahappy.gitbook.io/beatriz-bot-docs/welcome-command',
          slot1: 'https://beatriz-bot-website.vercel.app/'
        }),
        color: 561481
      }
    ]
  }
}
