import messages from '@/messages'
import type { MessageOptions } from '@/types/main'
import { Collection, type Locale, type Snowflake } from 'discord.js'

interface Props {
  id: Snowflake
  cooldown: number
  type: string
  name: string
  locale: Locale
}
/**
 * @returns `true` if the commands/buttons have access to execute
 */
export default function isCooldownEnable(props: Props): boolean {
  const { id, cooldown, type, name, locale } = props
  const { cooldowns } = globalThis
  const cooldownName = `${type}-${name}`
  if (!cooldowns.has(cooldownName)) cooldowns.set(cooldownName, new Collection())
  const now = Date.now()

  const timestamps = cooldowns.get(cooldownName)
  if (!timestamps) throw new Error('timestamps not found')
  if (timestamps.has(id)) return true

  timestamps.set(id, now)
  setTimeout(() => {
    timestamps.delete(id)
  }, cooldown * 1000)

  return false
}
