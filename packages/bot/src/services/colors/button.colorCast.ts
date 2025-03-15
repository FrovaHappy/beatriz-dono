import { getEmoji } from '@/const/emojis'
import BuildButton from '@/core/build/BuildButtons'
import db from '@db'
import { getPallete, rgbToHex, loadImage } from '@libs/colors'
import { ButtonStyle } from 'discord.js'
import msgColorCastNotFound from './msg.ColorCastNotFound'
import msgCreatePointerColor from './msg.createPointerColor'
import { changeColor } from './shared/changeColor'

export default new BuildButton({
  customId: 'colorCast',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  scope: 'public',
  resolve: 'update',
  style: ButtonStyle.Secondary,
  translates: {
    default: {
      name: 'Color Cast',
      emoji: getEmoji('colorWand')
    },
    'es-ES': {
      name: 'Color Cast',
      emoji: getEmoji('colorWand')
    }
  },
  async execute(i) {
    const { guildId, locale } = i
    if (!guildId) throw new Error('Guild ID not found')
    const { colors, pointer_id } = await db.colors.read(guildId)
    const colorPointerId = i.guild?.roles.cache.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})
    const url = i.user.displayAvatarURL({ extension: 'png', size: 512 })
    const data = await loadImage(url)
    const color = await getPallete({
      data
    })
    if (!color) return msgColorCastNotFound.getMessage(locale, {})
    console.log(color)

    const hex = rgbToHex(color[0])
    return changeColor({ colorCustom: hex, colorPointerId, colors, guildId, i, locale })
  }
})
