import { getEmoji } from '@/const/emojis'
import { ButtonNames, CommandNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { getDominanteColor, rgbToHex } from '@libs/colors'
import { ButtonBuilder, ButtonStyle } from 'discord.js'
import fetchColorCommand from './shared/fetchColorCommand'
import messages, { messagesColors } from '@/messages'
import { changeColor } from './shared/changeColor'

export default new BuildButton({
  name: ButtonNames.colorCast,
  permissions: [],
  scope: 'public',
  resolve: 'update',
  data: new ButtonBuilder().setLabel('Color Cast').setStyle(ButtonStyle.Secondary).setEmoji(getEmoji('colorWand')),
  async execute(i) {
    const { guildId, locale } = i
    if (!guildId) return messages.guildIdNoFound(locale)
    const { colors, colorPointerId } = await fetchColorCommand(guildId, i.guild?.roles.cache)
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

    const color = await getDominanteColor(i.user.displayAvatarURL({ extension: 'png', size: 512 }), 5)
    if (!color) return messagesColors.colorsCastNoFound(locale)

    const hex = rgbToHex(color)
    return changeColor({ colorCustom: hex, colorPointerId, colors, guildId, i, locale })
  }
})
