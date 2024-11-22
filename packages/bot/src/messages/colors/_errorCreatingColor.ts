import { ButtonNames } from '@/const/interactionsNames'
import { ActionRowBuilder, Colors, type Locale } from 'discord.js'

interface I18n {
  title: string
  description: string
  footer: string
}
const i18ns: Partial<Record<Locale, I18n>> = {
  'en-US': {
    title: 'Error creating color',
    description: 'There was an error creating the color',
    footer: 'Please contact the developer'
  },
  'es-ES': {
    title: 'Error creando color',
    description: 'Hubo un error creando el color',
    footer: 'Por favor, contacta al desarrollador'
  }
}
interface ErrorCreatingColorProps {
  locale: Locale
}
export default function errorCreatingColor(props: ErrorCreatingColorProps) {
  const { locale } = props
  const i18n = i18ns[locale] ?? (i18ns['en-US'] as I18n)
  return {
    embeds: [
      {
        title: i18n.title,
        description: i18n.description,
        color: Colors.Red,
        footer: { text: i18n.footer }
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
