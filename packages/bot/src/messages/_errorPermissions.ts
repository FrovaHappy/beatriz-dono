import { ButtonNames } from '@/const/interactionsNames'
import type { I18ns } from '@/shared/getI18n'
import getI18n from '@/shared/getI18n'
import type { MessageOptions } from '@/types/main'
import formatterText from '@libs/formatterText'
import { ActionRowBuilder, Colors, type Locale } from 'discord.js'
interface I18n {
  title: string
  description: string
  bot: string
  user: string
}
const i18ns: I18ns<I18n> = {
  'en-US': {
    title: 'Missing permissions for the {{slot0}}',
    description: 'The {{slot0}} requires the next permissions for functioning correctly:\n{{slot1}}',
    bot: 'bot',
    user: 'user'
  },
  'es-ES': {
    title: 'Permisos faltantes para el {{slot0}}',
    description: 'El {{slot0}} requiere los siguientes permisos para funcionar correctamente:\n{{slot1}}',
    bot: 'bot',
    user: 'usuario'
  }
}
export function errorPermissions(
  locale: Locale,
  service: string,
  permissions: string[],
  emitter: string
): MessageOptions {
  const formatPermissions = permissions.map(permission => `- **${permission}**`).join('\n')
  const i18n = getI18n(locale, i18ns)
  return {
    embeds: [
      {
        title: formatterText(i18n.title, { '{{slot0}}': i18n[emitter as 'bot' | 'user'] }),
        description: formatterText(i18n.description, { '{{slot0}}': service, '{{slot1}}': formatPermissions }),
        color: Colors.Red
      }
    ],
    components: [
      new ActionRowBuilder().addComponents(
        buttons.get(ButtonNames.linkDiscord).data,
        buttons.get(ButtonNames.linkGithubIssues).data
      )
    ]
  }
}
