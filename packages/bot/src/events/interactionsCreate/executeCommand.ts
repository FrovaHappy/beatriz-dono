import { type ChatInputCommandInteraction } from 'discord.js'
import isCooldownEnable from '../../isCooldownEnable'
import createServerDb from '../../shared/createServerDb'
import filterOwnerCommands from './filterOwnerCommands'
import hasPermissionsBot from './hasPermissionsBot'
import getI18n from '../../i18n'

export default async function executeCommand(interaction: ChatInputCommandInteraction): Promise<unknown> {
  const i18n = getI18n(interaction.locale)
  const command = globalThis.commands.get(interaction.commandName)
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }
  const { cooldown, name, type } = command
  if (!(await hasPermissionsBot(interaction, command))) return

  await interaction.deferReply({ ephemeral: command.ephemeral })

  const passFilter = filterOwnerCommands(command.scope, interaction.user.id)
  if (!passFilter) return await interaction.editReply({ content: 'only Owner has access to this.. >:(' })

  const serverId = interaction.guild?.id
  if (serverId) await createServerDb(serverId)

  const messageCooldown = await isCooldownEnable({ id: interaction.user.id, cooldown, name, type })
  if (messageCooldown) return await interaction.editReply({ content: messageCooldown })

  try {
    await interaction.editReply(await command.execute(interaction, i18n))
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}`)
    console.error(error)
  }
}
