import { ButtonNames } from '@/const/interactionsNames'
import getI18n, { type I18ns } from '@/shared/getI18n'
import formatterText from '@libs/formatterText'
import { ActionRowBuilder, Colors, type Locale } from 'discord.js'

interface I18n {
  title: string
  description: string
}
const i18ns: I18ns<I18n> = {
  'en-US': {
    title: 'Color Changed!',
    description: 'The color of the role was changed to {{slot0}}'
  },
  'es-ES': {
    title: '¡Color cambiado!',
    description: 'El color del rol fue cambiado a {{slot0}}'
  }
}

interface ChangedColorsUserProps {
  locale: Locale
  color: string | undefined
}
export default function changedColorsUser({ locale, color }: ChangedColorsUserProps) {
  const i18n = getI18n(locale, i18ns)
  return {
    embeds: [
      {
        title: i18n.title,
        description: formatterText(i18n.description, { '{{slot0}}': `<@&${color}>` }),
        color: Colors.Green
      }
    ],
    components: [
      new ActionRowBuilder().addComponents(
        buttons.get(ButtonNames.linkDiscord).data,
        buttons.get(ButtonNames.linkGithubIssues).data,
        buttons.get(ButtonNames.linkKofi).data
      )
    ]
  }
}
