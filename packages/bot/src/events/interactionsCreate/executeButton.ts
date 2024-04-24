import isCooldownEnable from '../../isCooldownEnable'
import createServerDb from '../../shared/createServerDb'
import type { CustomButtonInteraction } from '../../types/InteractionsCreate'
import filterOwnerCommands from './filterOwnerCommands'

export default async function executeCommand(interaction: CustomButtonInteraction): Promise<unknown> {
  const button = interaction.client.buttons.get(interaction.customId)
  if (!button) {
    console.error(`No command matching ${interaction.customId} was found.`)
    return
  }

  await interaction.deferReply({ ephemeral: button.ephemeral })

  const passFilter = filterOwnerCommands(button.scope, interaction.user.id)
  if (!passFilter) return await interaction.editReply({ content: 'only Owner has access to this.. >:(' })

  const serverId = interaction.guild?.id
  if (serverId) await createServerDb(serverId)

  const messageCooldown = await isCooldownEnable(interaction, button)
  if (messageCooldown) return await interaction.editReply({ content: messageCooldown })

  try {
    await button.execute(interaction)
  } catch (error) {
    console.error(`Error executing ${interaction.customId}`)
    console.error(error)
  }
}
