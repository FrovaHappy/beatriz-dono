import { ButtonNames } from '@/const/interactionsNames'
import type { MessageOptions } from '@/types/main'
import { ActionRowBuilder, Colors, type Locale } from 'discord.js'

export function errorPermissions(locale: Locale, service: string, permissions: string[]): MessageOptions {
  const formatPermissions = permissions.map(permission => `- **${permission}**`).join('\n')
  return {
    embeds: [
      {
        title: `/${service} command requires permissions.`,
        description: `The command requires the next permissions for functioning correctly:\n\n${formatPermissions}`,
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
