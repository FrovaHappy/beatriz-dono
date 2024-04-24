import isCooldownEnable from '../../isCooldownEnable'
import createServerDb from '../../shared/createServerDb'
import type { CustomCommandInteraction } from '../../types/InteractionsCreate'
import filterOwnerCommands from './filterOwnerCommands'
import hasPermissionsBot from './hasPermissionsBot'

export default async function executeCommand(interaction: CustomCommandInteraction): Promise<unknown> {
  const command = interaction.client.commands.get(interaction.commandName)
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }
  if (!(await hasPermissionsBot(interaction, command))) return

  await interaction.deferReply({ ephemeral: command.ephemeral })

  const passFilter = filterOwnerCommands(command.scope, interaction.user.id)
  if (!passFilter) return await interaction.editReply({ content: 'only Owner has access to this.. >:(' })

  const serverId = interaction.guild?.id
  if (serverId) await createServerDb(serverId)

  const messageCooldown = await isCooldownEnable(interaction, command)
  if (messageCooldown) return await interaction.editReply({ content: messageCooldown })

  try {
    await interaction.editReply(await command.execute(interaction))
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}`)
    console.error(error)
  }
}
