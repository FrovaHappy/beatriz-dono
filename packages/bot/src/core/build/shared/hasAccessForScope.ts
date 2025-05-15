import type { MessageOptions, Scope } from '@/types/main'
import type { Locale } from 'discord.js'
import messages from './msg.hasAccessToScope'

export function reorderScope(priv: string[], owner: string[]) {
  const dicc: Record<string, Scope> = {}

  // biome-ignore lint/complexity/noForEach: <explanation>
  priv.forEach(s => {
    dicc[s] = 'free'
  })
  // biome-ignore lint/complexity/noForEach: <explanation>
  owner.forEach(s => {
    dicc[s] = 'dev'
  })
  const grouping = Object.groupBy(Object.entries(dicc), ([, v]) => v)

  return {
    premium: grouping.premium?.map(([k]) => k) ?? [],
    dev: grouping.dev?.map(([k]) => k) ?? []
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
  const { dev, premium } = reorderScope(config.setting.privatesServers, config.setting.ownersServers)
  const isPrivate = premium.includes(guildId)
  const isOwner = dev.includes(guildId)

  if (scope === 'free') return true
  if (scope === 'premium') return isPrivate || isOwner // validate if the user is owner
  return isOwner
}
