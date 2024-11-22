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
export default function isCooldownEnable(props: Props): MessageOptions | undefined {
  const { id, cooldown, type, name, locale } = props
  const { cooldowns } = globalThis
  const cooldownName = `${type}-${name}`
  if (!cooldowns.has(cooldownName)) {
    cooldowns.set(cooldownName, new Collection())
  }

  const now = Date.now()
  try {
    const timestamps = cooldowns.get(cooldownName)
    if (!timestamps) throw new Error('timestamps not found')
    const cooldownAmount = cooldown * 1000

    if (timestamps.has(id)) {
      const expirationTime = Math.round(((timestamps.get(id) ?? 0) + cooldownAmount) / 1000)
      return messages.cooldownEnable(locale, expirationTime)
    }
    timestamps.set(id, now)
    setTimeout(() => {
      timestamps.delete(id)
    }, cooldownAmount)
    return
  } catch (e) {
    console.error(e)
    return messages.errorInService(locale, `cooldowns: ${cooldownName}`)
  }
}
