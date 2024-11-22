import { ButtonNames } from '@/const/interactionsNames'
import getI18n, { type I18ns } from '@/shared/getI18n'
import type { MessageOptions } from '@/types/main'
import { ActionRowBuilder, Colors, EmbedBuilder, type Locale } from 'discord.js'

interface I18n {
  title: string
  description: string
}
const i18ns: I18ns<I18n> = {
  'en-US': {
    title: 'Guild not found',
    description: 'The guild you are trying to access does not exist.'
  },
  'es-ES': {
    title: 'Guild Id no encontrado',
    description: 'el entorno donde intentas ejecutarme no existe.'
  }
}

export default function guildIdNoFound(locale: Locale): MessageOptions {
  const general = getI18n(locale, i18ns)
  const linkDiscord = buttons.get(ButtonNames.linkDiscord).data
  const linkGithubIssues = buttons.get(ButtonNames.linkGithubIssues).data
  const linkKofi = buttons.get(ButtonNames.linkKofi).data
  return {
    embeds: [
      new EmbedBuilder({
        title: general.title,
        color: Colors.Red,
        description: general.description
      })
    ],
    components: [new ActionRowBuilder().addComponents(linkDiscord, linkGithubIssues, linkKofi)]
  }
}