import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import BuildCommand from '@core/build/BuildCommand'
import db from '@core/db'
import validatesRoles from '../shared/validatesRoles'
import { CommandNames } from '@/const/interactionsNames'

export default new BuildCommand({
  data: new SlashCommandBuilder().setDescription('lista los colores del servidor.'),
  name: CommandNames.colorsList,
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
