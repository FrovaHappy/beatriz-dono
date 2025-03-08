import type { MessageOptions, Scope } from '@/types/main'
import type { Locale } from 'discord.js'
import messages from './msg.hasAccessToScope'

export function reorderScope(priv: string[], owner: string[]) {
  const dicc: Record<string, Scope> = {}

  // biome-ignore lint/complexity/noForEach: <explanation>
  priv.forEach(s => {
    dicc[s] = 'private'
  })
  // biome-ignore lint/complexity/noForEach: <explanation>
  owner.forEach(s => {
    dicc[s] = 'owner'
  })
  const grouping = Object.groupBy(Object.entries(dicc), ([, v]) => v)

  return {
    privates: grouping.private?.map(([k]) => k) ?? [],
    owners: grouping.owner?.map(([k]) => k) ?? []
  }
}

/**
 *
 * @param scope is the scope of the Service
 * @param guildId id of the guild server
 * @returns true if the Service can be executed in the server
 */
export function hasAccessForScope(scope: Scope, guildId: string): boolean {
  const { config } = globalThis
  const { privates, owners } = reorderScope(config.setting.privatesServers, config.setting.ownersServers)
  const isPrivate = privates.includes(guildId)
  const isOwner = owners.includes(guildId)

  if (scope === 'public') return true
  if (scope === 'private') return isPrivate || isOwner // validate if the user is owner
  return isOwner
}
