import { getEmoji } from '@/const/emojis'
import BuildButton from '@/core/build/BuildButtons'
import { getDominanteColor, rgbToHex } from '@libs/colors'
import { ButtonStyle } from 'discord.js'
import { changeColor } from './shared/changeColor'
import db from '@db'
import msgCreatePointerColor from './msg.createPointerColor'
import msgColorCastNotFound from './msg.ColorCastNotFound'

export default new BuildButton({
  customId: 'colorCast',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  scope: 'public',
  resolve: 'update',
  translates: {
    default: {
      name: 'Color Cast',
      style: ButtonStyle.Secondary,
      emoji: getEmoji('colorWand')
    },
    'es-ES': {
      name: 'Color Cast',
      style: ButtonStyle.Secondary,
      emoji: getEmoji('colorWand')
    }
  },
  async execute(i) {
    const { guildId, locale } = i
    if (!guildId) throw new Error('Guild ID not found')
    const { colors, pointer_id } = await db.colors.read(guildId)
    const colorPointerId = i.guild?.roles.cache.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})

    const color = await getDominanteColor(i.user.displayAvatarURL({ extension: 'png', size: 512 }), 5)
    if (!color) return msgColorCastNotFound.getMessage(locale, {})

    const hex = rgbToHex(color)
    return changeColor({ colorCustom: hex, colorPointerId, colors, guildId, i, locale })
  }
})
