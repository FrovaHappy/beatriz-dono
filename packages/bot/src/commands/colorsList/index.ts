import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import BuildCommand from '../../shared/BuildCommand'
import { CommandsNames } from '../../enums'
import db from '../../db'
import validatesRoles from '../shared/validatesRoles'
const name = CommandsNames.colorsList
export default new BuildCommand({
  data: new SlashCommandBuilder().setName(name).setDescription('lista los colores del servidor.'),
  name,
  permissions: [],
  scope: 'public',
  ephemeral: true,
  async execute(interaction) {
    const colorCommand = await db.colorCommand.findUnique({
      where: { serverId: interaction.guildId ?? '' },
      include: { colors: true }
    })

    if (!colorCommand) return { content: 'Requiere configuración' }
    const { validColorMain } = validatesRoles(interaction, colorCommand)
    if (!validColorMain) return { content: 'Requiere configuración' }

    const colors = colorCommand.colors ?? []
    let colorsUsage = 0
    colors.forEach(col => {
      const roleGuild = interaction.guild?.roles.cache.get(col.colorId)
      if (!roleGuild) return
      if (roleGuild.members.size > 0) colorsUsage += 1
    })
    return {
      embeds: [
        new EmbedBuilder()
          .setTitle('Lista de colores')
          .addFields(
            { name: 'Total de roles:', value: `${colors.length} roles`, inline: true },
            { name: 'Total de usados:', value: `${colorsUsage} roles`, inline: true }
          )
          .setColor('Random').setDescription(`
            ${colors.map(col => `<@&${col.colorId}>`).join('  <:minimize:1163923149717512323>  ')}
          `)
      ]
    }
  }
})
