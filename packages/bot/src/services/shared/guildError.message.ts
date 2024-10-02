import { ButtonNames } from '@/const/interactionsNames'
import { getI18n } from '@/i18n'
import type { MessageOptions } from '@/types/main'
import { ActionRowBuilder, Colors, EmbedBuilder, type Locale } from 'discord.js'

export default function guildErrorMessage(locale: Locale): MessageOptions {
  const general = getI18n(locale, 'general')
  const linkDiscord = buttons.get(ButtonNames.linkDiscord).data
  const linkGithubIssues = buttons.get(ButtonNames.linkGithubIssues).data
  const linkKofi = buttons.get(ButtonNames.linkKofi).data
  return {
    embeds: [
      new EmbedBuilder({
        title: general.errorGuild.title,
        color: Colors.Red,
        description: general.errorGuild.description
      })
    ],
    components: [new ActionRowBuilder().addComponents(linkDiscord, linkGithubIssues, linkKofi)]
  }
}
