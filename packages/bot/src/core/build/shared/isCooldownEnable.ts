import { Collection, type Snowflake } from 'discord.js'

interface Props {
  id: Snowflake
  cooldown: number | undefined
  type: string
  name: string
}
/**
 * @returns `true` if the commands/buttons have access to execute
 */
export default function isCooldownEnable(props: Props) {
  const { config } = globalThis
  const { id, cooldown, type, name } = props
  const { cooldowns } = globalThis
  const cooldownName = `${type}-${name}`
  if (!cooldowns.has(cooldownName)) {
    cooldowns.set(cooldownName, new Collection())
  }

  const now = Date.now()
  try {
    const timestamps = cooldowns.get(cooldownName)
    if (!timestamps) throw new Error(`Cannot find ${cooldownName} in cooldowns`)
    const cooldownAmount = (cooldown ?? config.cooldown) * 1000

    if (timestamps.has(id)) {
      const expirationTime = timestamps.get(id) ?? 0 + cooldownAmount
      const expiredTimestamp = Math.round(expirationTime / 1000)
      return `Please wait, you are on a cooldown for \`${name}\`. You can use it again <t:${expiredTimestamp}:R>.`
    }
    timestamps.set(id, now)
    setTimeout(() => {
      timestamps.delete(id)
    }, cooldownAmount)
    return null
  } catch (e) {
    console.error(e)
    return `Error in action \`${cooldownName}\` to compare the cooldown.`
  }
}
