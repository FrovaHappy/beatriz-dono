import type { Color, Prisma } from '@prisma/client'
import type { GuildMemberRoleManager, Interaction } from 'discord.js'
type ReturnData = Prisma.ColorUncheckedCreateInput

interface Props {
  interaction: Interaction
  colors: Color[]
}
export default async function removeRoleOfUser({ interaction, colors }: Props): Promise<ReturnData[] | undefined> {
  for (const color of colors) {
    const roles = interaction.member?.roles as GuildMemberRoleManager
    if (roles.cache.has(color.colorId)) {
      await roles.remove(color.colorId)
    }
  }
  return colors
}
