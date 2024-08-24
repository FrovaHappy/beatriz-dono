import type { Interaction, Role } from 'discord.js'

export default async function createRole(interaction: Interaction): Promise<Role | null> {
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
