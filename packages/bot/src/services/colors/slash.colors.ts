import { CommandNames } from '@/const/interactionsNames'
import { getI18n, getI18nCollection } from '@/i18n'
import BuildCommand from '@core/build/BuildCommand'
import { type GuildMemberRoleManager, Locale, SlashCommandBuilder } from 'discord.js'
import fetchColorCommand from './shared/fetchColorCommand'
import { reduceTupleToObj } from '@/shared/general'

import messages, { messagesColors } from '@/messages'
import { changeColor } from './shared/changeColor'

const en = getI18n(Locale.EnglishUS, CommandNames.colors)
const languages = getI18nCollection(CommandNames.colors)

export default new BuildCommand({
  name: CommandNames.colors,
  ephemeral: true,
  scope: 'public',
  permissionsBot: ['ManageRoles'],
  resolve: 'defer',
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setDescription(en.description)
    .setDescriptionLocalizations(reduceTupleToObj(languages, 'description'))
    .addStringOption(strOp =>
      strOp
        .setName('custom')
        .setDescription(en.options.custom)
        .setDescriptionLocalizations(reduceTupleToObj(languages, 'options.custom'))
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
