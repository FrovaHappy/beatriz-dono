import { getEmoji } from '@/const/emojis'
import BuildButton from '@/core/build/BuildButtons'
import db from '@db'
import { getPallete, rgbToHex } from '@libs/colors'
import { getImageData } from '@libs/server'
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
    const query = await db.colors.read({ guild_id: guildId })
    if (!query) throw new Error('error in query Database')
    const { colors, pointer_id } = query
    const colorPointerId = i.guild?.roles.cache.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})
    const url = i.user.displayAvatarURL({ extension: 'png', size: 512 })
    const data = (await getImageData(url))?.data ?? null
    const color = getPallete({
      data
    })
    if (color.length === 0) return msgColorCastNotFound.getMessage(locale, {})
    return changeColor({ colorCustom: color[0], colorPointerId, colors, guildId, i, locale })
  }
})
