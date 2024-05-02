import { type ButtonInteraction } from 'discord.js'
import isCooldownEnable from '../../isCooldownEnable'
import createServerDb from '../../shared/createServerDb'
import filterOwnerCommands from './filterOwnerCommands'
import getI18n from '../../i18n'

export default async function executeCommand(interaction: ButtonInteraction): Promise<unknown> {
  const i18n = getI18n(interaction.locale)
  const button = globalThis.buttons.get(interaction.customId)
  if (!button) {
    console.error(`No command matching ${interaction.customId} was found.`)
    return
  }
  const { name, cooldown, type } = button

  await interaction.deferReply({ ephemeral: button.ephemeral })

  const passFilter = filterOwnerCommands('public', interaction.user.id) // TODO: check access to executed commands
  if (!passFilter) return await interaction.editReply({ content: 'only Owner has access to this.. >:(' })

  const serverId = interaction.guild?.id
  if (serverId) await createServerDb(serverId)

  const messageCooldown = await isCooldownEnable({ id: interaction.user.id, cooldown, name, type })
  if (messageCooldown) return await interaction.editReply({ content: messageCooldown })

  try {
    await button.execute(interaction, i18n)
  } catch (error) {
    console.error(`Error executing ${interaction.customId}`)
    console.error(error)
  }
}
