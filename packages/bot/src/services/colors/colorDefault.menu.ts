import COLORS from '@/const/colors'
import { CommandNames, MenuNames } from '@/const/interactionsNames'
import BuildMenu from '@/core/build/BuildMenu'
import { getI18n } from '@/i18n'
import { Locale, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js'
import fetchColorCommand from './shared/fetchColorCommand'
import messages, { messagesColors } from '@/messages'
import { changeColor } from './shared/changeColor'

const en = getI18n(Locale.EnglishUS, CommandNames.colors)

export default new BuildMenu({
  name: MenuNames.colorDefault,
  resolve: 'update',
  permissions: [],
  data: new StringSelectMenuBuilder({
    placeholder: en.colorsDefault.placeholder
  }).addOptions(
    ...COLORS.map(color => {
      return new StringSelectMenuOptionBuilder().setValue(color.hexColor).setLabel(color.label).setEmoji(color.emoji)
    })
  ),
  execute: async i => {
    const { values, guildId, locale } = i
    const roles = i.guild?.roles.cache
    if (!guildId) return messages.guildIdNoFound(locale)

    const { colors, colorPointerId } = await fetchColorCommand(guildId, roles)
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

    const colorSelected = values[0] as `#${string}`
    return changeColor({ colorCustom: colorSelected, colorPointerId, colors, guildId, i, locale })
  }
})
