import { getI18n } from '@/i18n'
import type { MessageOptions, Scope } from '@/types/main'
import formatterText from '@lib/formatterText'
import { Colors, EmbedBuilder, type Locale } from 'discord.js'

/**
 *
 * @param scope is the scope of the Service
 * @param guildId id of the guild server
 * @returns true if the Service can be executed in the server
 */

export function hasAccessForScope(scope: Scope, guildId: string): boolean {
  const { config } = globalThis
  const isPrivate = config.privatesServers.includes(guildId)
  const isOwner = config.ownersServers.includes(guildId)

  if (scope === 'public') return true
  if (scope === 'private') return isPrivate || isOwner // validate if the user is owner
  return isOwner
}

export default function buildMessageErrorForScope(
  locale: Locale,
  scope: Scope,
  guildId: string
): MessageOptions | undefined {
  const i18n = getI18n(locale, 'general')
  if (!hasAccessForScope(scope, guildId)) return
  return {
    embeds: [
      new EmbedBuilder({
        title: i18n.errorAccessScope.title,
        description: formatterText(i18n.errorAccessScope.description, { slot0: scope }),
        color: Colors.Red
      })
    ]
  }
}
