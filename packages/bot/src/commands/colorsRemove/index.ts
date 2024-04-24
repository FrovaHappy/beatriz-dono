import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { BuildCommand } from '../../buildersSchema'
import { CommandsNames } from '../../enums'
import actionNoUsages from './actionNoUsages'
import db from '../../db'
import messages from '../colors/messages'
import validatesRoles from '../shared/validatesRoles'
const name = CommandsNames.colorsRemove
const enum Actions {
  noUsages = 'no-usages',
  all = 'all',
  selected = 'selected'
}
export default BuildCommand({
  name,
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription('Elimina los roles no utilizados por el jugador.')
    .addStringOption(op =>
      op
        .setName('actions')
        .setRequired(true)
        .setDescription('selecciona la acción a realizar')
        .setChoices({ name: 'not usages', value: Actions.noUsages })
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  cooldown: 3 * 60 * 60,
  ephemeral: true,
  scope: 'public',
  async execute(interaction) {
    const colorCommand = await db.colorCommand.findUnique({
      where: { serverId: interaction.guildId ?? '' },
      include: { colors: true }
    })

    if (!colorCommand) return messages.requireSettings({ interaction })

    const { validColorMain } = validatesRoles(interaction, colorCommand)
    if (!validColorMain) return messages.requireSettings({ interaction })
    const { colors } = colorCommand
    const action = interaction.options.getString('actions')
    if (action === Actions.noUsages) {
      const result = await actionNoUsages(interaction, colors)
      return {
        content: `
        Roles no usados eliminados: ${result.deleteForNoUsages}
        Roles eliminados manualmente: ${result.delForUndefined}
        `
      }
    }
    return { content: 'operation without implementation' }
  }
})
