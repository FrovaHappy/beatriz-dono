import messages from '@/messages'
import type { MessageOptions, Scope } from '@/types/main'
import type { Locale } from 'discord.js'

/**
 *
 * @param scope is the scope of the Service
 * @param guildId id of the guild server
 * @returns true if the Service can be executed in the server
 */

export function hasAccessForScope(scope: Scope, guildId: string): boolean {
  const { config } = globalThis
  const isPrivate = config.setting.privatesServers.includes(guildId)
  const isOwner = config.setting.ownersServers.includes(guildId)

  if (scope === 'public') return true
  if (scope === 'private') return isPrivate || isOwner // validate if the user is owner
  return isOwner
}

export default function buildMessageErrorForScope(
  locale: Locale,
  scope: Scope,
  guildId: string
): MessageOptions | undefined {
  if (hasAccessForScope(scope, guildId)) return
  return messages.accessDeniedForScope({ locale, scope })
}
