import { Collection, type Snowflake } from 'discord.js'

interface Props {
  id: Snowflake
  cooldown: number
  keyId: string
}

export function parseTimestamp(keyId: string, id: Snowflake, cooldown: number) {
  return (globalThis.cooldowns.get(keyId)?.get(id) ?? 0) + cooldown
}
/**
 * @param props.keyId - The key to identify the cooldown example: button:customId
 * @param props.id - The id of the user
 * @param props.cooldown - The cooldown in seconds
 * @returns `true` if the commands/buttons have access to execute
 */
export default function isCooldownEnable(props: Props): boolean {
  const { id, cooldown, keyId } = props
  const { cooldowns } = globalThis
  if (!cooldowns.has(keyId)) cooldowns.set(keyId, new Collection())
  const now = Math.round(Date.now() / 1000)
  const timestamps = cooldowns.get(keyId)
  if (!timestamps) throw new Error('timestamps not found')
  if (timestamps.has(id)) return true

  timestamps.set(id, now)
  setTimeout(() => {
    timestamps.delete(id)
  }, cooldown * 1000)

  return false
}
