import BuildModal from '@/core/build/BuildModal'
import db from '@/database'
import { ButtonStyle, TextInputStyle } from 'discord.js'
import { validate, COLORS_PLACEHOLDER } from '@libs/schemas/colorsTemplete'
import msgCreatePointerColor from '../msg.createPointerColor'
import msgErrorWithInput from './msg.errorWithInput'
import msgUpdatedTemplete from './msg.updatedTemplete'

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
        value: JSON.stringify(COLORS_PLACEHOLDER),
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
  scope: 'public',
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
    const jsonColors = validate(colorsInput)
    if (jsonColors.error)
      return msgErrorWithInput.getMessage(locale, {
        '{{slot0}}': jsonColors.data.title,
        '{{slot1}}': jsonColors.data.description
      })

    // update database
    await db.colors.update({
      guild_id: guildId,
      templete: JSON.stringify(jsonColors.data)
    })
    return msgUpdatedTemplete.getMessage(locale, {})
  }
})
