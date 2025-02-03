import COLORS from '@/const/colors'
import { MenuNames } from '@/const/interactionsNames'
import BuildMenu from '@/core/build/BuildMenu'
import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js'
import messages, { messagesColors } from '@/messages'
import { changeColor } from './shared/changeColor'
import db from '@/core/database'

export default new BuildMenu({
  name: MenuNames.colorDefault,
  resolve: 'update',
  permissionsBot: ['ManageRoles'],
  data: new StringSelectMenuBuilder({
    placeholder: 'Select a color'
  }).addOptions(
    ...COLORS.map(color => {
      return new StringSelectMenuOptionBuilder().setValue(color.hexColor).setLabel(color.label).setEmoji(color.emoji)
    })
  ),
  execute: async i => {
    const { values, guildId, locale } = i
    const roles = i.guild?.roles.cache
    if (!guildId) return messages.guildIdNoFound(locale)

    const { colors, pointer_id } = await db.colors.read(guildId)
    const colorPointerId = roles?.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

    const colorSelected = values[0] as `#${string}`
    return changeColor({ colorCustom: colorSelected, colorPointerId, colors, guildId, i, locale })
  }
})
