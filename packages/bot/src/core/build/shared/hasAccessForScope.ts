import type { Scope } from '@/types/main'

export default function hasAccessForScope(scope: Scope, guildId: string): boolean {
  const { config } = globalThis
  const isPrivate = config.privatesServers.includes(guildId)
  const isOwner = config.ownersServers.includes(guildId)

  if (scope === 'public') return false
  if (scope === 'private') return isPrivate || isOwner // validate if the user is owner
  return isOwner
}
