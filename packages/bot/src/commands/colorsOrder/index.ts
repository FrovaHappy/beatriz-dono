import { type RoleResolvable, SlashCommandBuilder, type Role, PermissionFlagsBits } from 'discord.js'
import { BuildCommand } from '../../buildersSchema'
import { CommandsNames } from '../../enums'
import type { CustomCommandInteraction } from '../../types/InteractionsCreate'
import db from '../../db'
import validatesRoles from '../shared/validatesRoles'
import messages from '../colors/messages'
interface Positions {
  position: number
  role: RoleResolvable
}
const name = CommandsNames.colorsOrder
export default BuildCommand({
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription('Ordena los roles ya creados.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  name,
  ephemeral: true,
  scope: 'public',
  cooldown: 60,
  async execute(i: CustomCommandInteraction) {
    const colorCommand = await db.colorCommand.findUnique({
      where: { serverId: i.guildId ?? '' },
      include: { colors: true }
    })
    if (!colorCommand) return messages.requireSettings({ interaction: i })
    const { validColorMain } = validatesRoles(i, colorCommand)
    if (!validColorMain) return messages.requireSettings({ interaction: i })

    const { colors, pointerId } = colorCommand
    const colorMain = i.guild?.roles.cache.find(r => r.id === pointerId) as Role
    const positions: Positions[] = []

    for await (const color of colors) {
      const role = i.guild?.roles.cache.find(r => r.id === color.colorId)
      if (role) positions.push({ position: colorMain.rawPosition, role })
      if (!role) await db.color.delete({ where: color })
    }
    await i.guild?.roles.setPositions(positions)

    return { content: `Roles ordenados en la position ${colorMain.rawPosition}` }
  }
})
