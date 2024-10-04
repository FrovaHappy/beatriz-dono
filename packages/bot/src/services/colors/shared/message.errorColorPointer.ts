import { ButtonNames, CommandNames } from '@/const/interactionsNames'
import { getI18n } from '@/i18n'
import { ActionRowBuilder, Colors, EmbedBuilder, type Locale } from 'discord.js'

export default function messageErrorColorPointer(locale: Locale) {
  const i18n = getI18n(locale, CommandNames.colors)
  return {
    embeds: [
      new EmbedBuilder({
        title: i18n.errorColorPointer.title,
        description: i18n.errorColorPointer.description,
        footer: { text: i18n.errorColorPointer.footer },
        color: Colors.Red
      })
    ],
    components: [
      new ActionRowBuilder().addComponents(
        buttons.get(ButtonNames.linkDiscord).data,
        buttons.get(ButtonNames.linkGithubIssues).data,
        buttons.get(ButtonNames.setting).data
      )
    ]
  }
}
