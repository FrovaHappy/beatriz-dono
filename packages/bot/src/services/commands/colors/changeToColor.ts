import { type Color } from '@prisma/client'
import db from '@core/db'
import { type Interaction } from 'discord.js'
interface Props {
  color: `#${string}`
  interaction: Interaction
  colors: Color[]
  pointerId: string
}
interface ReturnData {
  hasCreated: boolean
  hasSusses: boolean
}
export default async function changeToColor({ color, interaction, colors, pointerId }: Props): Promise<ReturnData> {
  const { guild, user, guildId } = interaction
  const coincidence = colors.find(c => c.hexColor === color)
  const role = guild?.roles.cache.find(r => r.id === coincidence?.colorId)
  const colorController = guild?.roles.cache.find(r => r.id === pointerId)

  if (!colorController) return { hasCreated: false, hasSusses: false }
  if (role) {
    globalThis.cooldowns.get('command-colors')?.delete(user.id)
    const member = await guild?.members.addRole({ user, role })
    return { hasCreated: false, hasSusses: Boolean(member) }
  } else if (coincidence) {
    await db.color.delete({ where: coincidence })
  }

  const newRole = await guild?.roles.create({
    color,
    hoist: false,
    mentionable: false,
    name: `color: ${color}`
  })
  if (!newRole) return { hasCreated: false, hasSusses: false }
  await guild?.roles.setPosition(newRole, colorController.rawPosition)
  const member = await guild?.members.addRole({ user, role: newRole })
  const update = await db.colorCommand.update({
    where: { serverId: guildId ?? '' },
    data: { colors: { create: { colorId: newRole.id, hexColor: color } } }
  })

  if (!update || !member) return { hasCreated: true, hasSusses: false }
  return { hasCreated: true, hasSusses: true }
}
