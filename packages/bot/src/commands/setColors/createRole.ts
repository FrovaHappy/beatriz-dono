import type { Role } from 'discord.js'
import type { CustomCommandInteraction } from '../../types/InteractionsCreate'

export default async function createRole(interaction: CustomCommandInteraction): Promise<Role | null> {
  const role = await interaction.guild?.roles
    .create({
      name: `🎨 Controller colors (${interaction.client.user?.username})`,
      hoist: false,
      permissions: '0'
    })
    .then(role => role)
  if (!role) return null
  return role
}
