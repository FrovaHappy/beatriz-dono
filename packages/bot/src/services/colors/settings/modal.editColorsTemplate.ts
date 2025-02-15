import { ModalNames } from '@/const/interactionsNames'
import BuildModal from '@/core/build/BuildModal'
import db from '@/database'
import { ActionRowBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import { parseToLatest, validate, type ColorsTempleteLatest } from '@libs/schemas/colorsTemplete'
import messages, { messagesColors } from '@/messages'

const COLORS_PLACEHOLDER = JSON.stringify({
  version: 'v2',
  colors: [
    { label: 'Black', hex_color: '#000000' },
    { label: 'White', hex_color: '#ffffff' }
  ]
} satisfies ColorsTempleteLatest)

const textEdit = new TextInputBuilder({
  label: 'Color',
  placeholder: 'Color',
  customId: 'input',
  required: true,
  value: COLORS_PLACEHOLDER,
  style: TextInputStyle.Paragraph,
  type: ComponentType.TextInput
})
const rows = new ActionRowBuilder<TextInputBuilder>().addComponents(textEdit)

export default new BuildModal({
  name: ModalNames.editColorDefault,
  ephemeral: true,
  resolve: 'update',
  data: new ModalBuilder({ title: 'Edit Color Default' }).addComponents(rows),
  permissionsBot: ['ManageRoles'],
  async execute(i) {
    const { guildId, locale } = i
    if (!guildId) return messages.guildIdNoFound(locale)
    const roles = i.guild?.roles.cache
    const { pointer_id } = await db.colors.read(guildId)
    const colorPointerId = pointer_id ?? roles?.first()?.id
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

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
