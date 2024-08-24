import { type RoleResolvable, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js'
import BuildCommand from '@core/build/BuildCommand'
import db from '@core/db'
import validatesRoles from '../shared/validatesRoles'
import { CommandNames } from '@/const/interactionsNames'
interface Positions {
  position: number
  role: RoleResolvable
}
export default new BuildCommand({
  data: new SlashCommandBuilder()
    .setDescription('Ordena los roles ya creados.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  name: CommandNames.colorsOrder,
  ephemeral: true,
  scope: 'public',
  permissions: [],
  cooldown: 60,
  async execute(i) {
    const reqPreviousSetting = {
      embeds: [
        {
          title: 'Este Comando Requiere de acciones Previas',
          description: 'ejecuta el comando `/set-colors` ☕'
        }
      ]
    }
    const colorCommand = await db.colorCommand.findUnique({
      where: { serverId: i.guildId ?? '' },
      include: { colors: true }
    })
    if (!colorCommand) return reqPreviousSetting
    const { validColorMain } = validatesRoles(i, colorCommand)
    if (!validColorMain) return reqPreviousSetting

    const { colors, pointerId } = colorCommand
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const colorMain = i.guild!.roles.cache.find(r => r.id === pointerId)!
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
