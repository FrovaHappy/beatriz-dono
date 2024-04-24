import { Collection } from 'discord.js'
import type { BaseEventInteractionCreate } from './types/main'
import type { CustomBaseInteraction } from './types/InteractionsCreate'
import { getSetting } from './setting'
type ReturnMessage = string | null
export default async function isCooldownEnable(
  interaction: CustomBaseInteraction,
  command: BaseEventInteractionCreate
): Promise<ReturnMessage> {
  const { cooldowns } = interaction.client
  const cooldownName = `${command.type}-${command.name}`
  if (!cooldowns.has(cooldownName)) {
    cooldowns.set(cooldownName, new Collection())
  }

  const now = Date.now()
  try {
    const timestamps = cooldowns.get(cooldownName)
    if (!timestamps) throw new Error(`Cannot find ${cooldownName} in cooldowns`)
    const defaultCooldownDuration = getSetting().cooldown
    const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) ?? 0 + cooldownAmount
      const expiredTimestamp = Math.round(expirationTime / 1000)
      return `Please wait, you are on a cooldown for \`${command.name}\`. You can use it again <t:${expiredTimestamp}:R>.`
    }
    timestamps.set(interaction.user.id, now)
    setTimeout(() => {
      timestamps.delete(interaction.user.id)
    }, cooldownAmount)
    return null
  } catch (e) {
    console.error(e)
    return `Error in action \`${cooldownName}\` to compare the cooldown.`
  }
}
