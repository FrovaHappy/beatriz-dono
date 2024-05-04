import { type AnySelectMenuInteraction } from 'discord.js'
import isCooldownEnable from '@core/shared/isCooldownEnable'
import createServerDb from '@core/shared/createServerDb'
import filterOwnerCommands from './filterOwnerCommands'
import getI18n from '../../i18n'
import { type Menu } from '@/core/build/BuildMenu'

export default async function executeMenu(interaction: AnySelectMenuInteraction): Promise<unknown> {
  const i18n = getI18n(interaction.locale)
  const menu: Menu | undefined = globalThis.menus.get(interaction.customId)
  if (!menu) {
    console.error(`No command matching ${interaction.customId} was found.`)
    return
  }
  const { name, cooldown, type } = menu

  await interaction.deferReply({ ephemeral: menu.ephemeral })

  const passFilter = filterOwnerCommands('public', interaction.user.id) // TODO: check access to executed commands
  if (!passFilter) return await interaction.editReply({ content: 'only Owner has access to this.. >:(' })

  const serverId = interaction.guild?.id
  if (serverId) await createServerDb(serverId)

  const messageCooldown = await isCooldownEnable({ id: interaction.user.id, cooldown, name, type })
  if (messageCooldown) return await interaction.editReply({ content: messageCooldown })

  try {
    await interaction.editReply(await menu.execute(interaction, i18n))
  } catch (error) {
    console.error(`Error executing ${interaction.customId}`)
    console.error(error)
  }
}
