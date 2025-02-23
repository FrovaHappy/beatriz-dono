import BuildModal from '@/core/build/BuildModal'
import db from '@/database'
import { ButtonStyle, TextInputStyle } from 'discord.js'
import { parseToLatest, validate, type ColorsTempleteLatest } from '@libs/schemas/colorsTemplete'
import { messagesColors } from '@/messages'
import msgCreatePointerColor from '../msg.createPointerColor'

const COLORS_PLACEHOLDER = JSON.stringify({
  version: 'v2',
  colors: [
    { label: 'Black', hex_color: '#000000' },
    { label: 'White', hex_color: '#ffffff' }
  ]
} satisfies ColorsTempleteLatest)

export default new BuildModal({
  customId: 'editColorsTemplate',
  ephemeral: true,
  resolve: 'update',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  translates: {
    title: {
      default: 'Edit Template',
      'es-ES': 'Editar Plantilla'
    },
    components: [
      {
        customId: 'input',
        required: true,
        value: COLORS_PLACEHOLDER,
        style: TextInputStyle.Paragraph,
        translates: {
          default: {
            label: 'Color',
            placeholder: 'Color'
          },
          'es-ES': {
            label: 'Color',
            placeholder: 'Color'
          }
        }
      }
    ]
  },
  scope: 'private',
  dataButton: {
    style: ButtonStyle.Primary,
    translates: {
      default: {
        name: 'Edit Template'
      },
      'es-ES': {
        name: 'Editar Plantilla'
      }
    }
  },
  cooldown: 15,

  async execute(i) {
    const { guildId, locale } = i
    if (!guildId) throw new Error('Guild ID not found')
    const roles = i.guild?.roles.cache
    const { pointer_id } = await db.colors.read(guildId)
    const colorPointerId = pointer_id ?? roles?.first()?.id
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})

    // validate JSON color
    const colorsInput = i.fields.getTextInputValue('input')
    const data = validate(colorsInput)
    if (data.error) return messagesColors.editColorTemplate.jsonInvalid(locale, data.data)

    const jsonColors = parseToLatest(data.data)
    if (!jsonColors)
      return messagesColors.editColorTemplate.jsonInvalid(locale, {
        title: 'Error update color template',
        description: 'if this error persists, please contact the developer'
      })

    // update database
    await db.colors.update({
      guild_id: guildId,
      templete: jsonColors
    })
    return messagesColors.editColorTemplate.success(locale)
  }
})
