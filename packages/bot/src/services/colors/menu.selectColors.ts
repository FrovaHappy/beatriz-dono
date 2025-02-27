import COLORS from '@/const/colors'
import BuildMenu from '@/core/build/BuildMenu'
import { changeColor } from './shared/changeColor'
import db from '@db'
import msgCreatePointerColor from './msg.createPointerColor'
import { COLORS_PLACEHOLDER } from '@libs/schemas/colorsTemplete'

const optionsColors = COLORS_PLACEHOLDER.colors.map(color => ({
  label: color.label,
  value: color.hex_color,
  emoji: color.emoji
}))

export default new BuildMenu<'string'>({
  customId: 'selectColors',
  resolve: 'update',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  scope: 'public',
  typeData: 'string',
  translates: {
    default: {
      placeholder: 'Select a color',
      options: optionsColors
    },
    'es-ES': {
      placeholder: 'Selecciona un color',
      options: optionsColors
    }
  },
  execute: async i => {
    const { values, guildId, locale } = i
    const roles = i.guild?.roles.cache
    if (!guildId) throw new Error('Guild ID not found')

    const { colors, pointer_id } = await db.colors.read(guildId)
    const colorPointerId = roles?.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})

    const colorSelected = values[0] as `#${string}`
    return changeColor({ colorCustom: colorSelected, colorPointerId, colors, guildId, i, locale })
  }
})
