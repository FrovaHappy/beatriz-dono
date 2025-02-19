import { getEmoji } from '@/const/emojis'
import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { getDominanteColor, rgbToHex } from '@libs/colors'
import { ButtonBuilder, ButtonStyle } from 'discord.js'
import messages, { messagesColors } from '@/messages'
import { changeColor } from './shared/changeColor'
import db from '@db'
import msgCreatePointerColor from './msg.createPointerColor'
import msgColorCastNotFound from './msg.ColorCastNotFound'

export default new BuildButton({
  name: ButtonNames.colorCast,
  permissionsBot: ['ManageRoles'],
  scope: 'public',
  resolve: 'update',
  data: new ButtonBuilder().setLabel('Color Cast').setStyle(ButtonStyle.Secondary).setEmoji(getEmoji('colorWand')),
  async execute(i) {
    const { guildId, locale } = i
    if (!guildId) return messages.guildIdNoFound(locale)
    const { colors, pointer_id } = await db.colors.read(guildId)
    const colorPointerId = i.guild?.roles.cache.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})

    const color = await getDominanteColor(i.user.displayAvatarURL({ extension: 'png', size: 512 }), 5)
    if (!color) return msgColorCastNotFound.getMessage(locale, {})

    const hex = rgbToHex(color)
    return changeColor({ colorCustom: hex, colorPointerId, colors, guildId, i, locale })
  }
})
