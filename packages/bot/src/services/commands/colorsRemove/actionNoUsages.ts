import { type Color } from '@prisma/client'
import db from '@core/db'
import { type Interaction } from 'discord.js'
interface Result {
  delForUndefined: number
  deleteForNoUsages: number
}
export default async function actionNoUsages(interaction: Interaction, colors: Color[]): Promise<Result> {
  const result: Result = {
    delForUndefined: 0,
    deleteForNoUsages: 0
  }
  for (const color of colors) {
    const role = interaction.guild?.roles.cache.find(r => r.id === color.colorId)
    if (!role) {
      await db.color.delete({ where: color })
      result.delForUndefined += 1
      continue
    }
    if (role.members.size === 0) {
      await db.color.delete({ where: color })
      await interaction.guild?.roles.delete(role)
      result.deleteForNoUsages += 1
    }
  }
  return result
}
