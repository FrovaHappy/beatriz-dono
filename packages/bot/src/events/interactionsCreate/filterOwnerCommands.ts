import config from '@core/config'

/**
 * @returns `true` if the commands/buttons have access to execute
 */
export default function filterOwnerCommands(scope: 'public' | 'private' | 'owner', userId: string): boolean {
  if (scope !== 'owner') return true
  return config.discordOwner.some(uid => userId === uid)
}
