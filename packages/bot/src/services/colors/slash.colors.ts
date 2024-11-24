import { CommandNames } from '@/const/interactionsNames'
import BuildCommand from '@core/build/BuildCommand'
import { type GuildMemberRoleManager, Locale, SlashCommandBuilder } from 'discord.js'
import fetchColorCommand from './shared/fetchColorCommand'
import { reduceTupleToObj } from '@/shared/general'

import messages, { messagesColors } from '@/messages'
import { changeColor } from './shared/changeColor'

export default new BuildCommand({
  name: CommandNames.colors,
  ephemeral: true,
  scope: 'public',
  permissionsBot: ['ManageRoles'],
  resolve: 'defer',
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setDescription('Change the color of your nickname')
    .setDescriptionLocalizations({
      'es-ES': 'Cambia el color de tu nombre',
      'es-419': 'Cambia el color de tu nombre'
    })
    .addStringOption(strOp =>
      strOp
        .setName('custom')
        .setDescription('add a color custom')
        .setDescriptionLocalizations({
          'es-ES': 'añade un color personalizado',
          'es-419': 'añade un color personalizado'
        })
        .setRequired(false)
    ),
  execute: async i => {
    const { guildId, locale } = i
    const roles = i.guild?.roles.cache
    if (!guildId) return messages.guildIdNoFound(locale)

    const { colorPointerId, colors, colorsDefault } = await fetchColorCommand(guildId, roles)
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

    const colorCustom = i.options.getString('custom')?.toLowerCase()
    if (colorCustom) return changeColor({ colorCustom, colorPointerId, colors, guildId, i, locale })

    const colorCurrent = colors.find(c => (i.member?.roles as GuildMemberRoleManager)?.cache.get(c.roleId))
    return messagesColors.menuColors({ locale, colorsDefault, colorCurrent })
  }
})