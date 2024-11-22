import { ModalNames } from '@/const/interactionsNames'
import BuildModal from '@/core/build/BuildModal'
import db from '@/core/db'
import { ActionRowBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import { validate, CURRENT_VERSION } from '../schema.color'
import messages, { messagesColors } from '@/messages'
import fetchColorCommand from '../shared/fetchColorCommand'

const COLORS_PLACEHOLDER = `
{
  "version": "v1",
  "values": [
    { "hexcolor": "#000000", "label": "Black" },
    { "hexcolor": "#ffffff", "label": "White" }
  ]
}
`

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
  permissions: [],
  async execute(i) {
    const { guildId, locale } = i
    if (!guildId) return messages.guildIdNoFound(locale)
    const roles = i.guild?.roles.cache
    const { colorPointerId } = await fetchColorCommand(guildId, roles)
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

    // validate JSON color
    const colorsInput = i.fields.getTextInputValue('input')
    const errorColors = validate(colorsInput)
    if (errorColors) return messagesColors.editColorTemplate.jsonInvalid(locale, errorColors)

    // if the json is valid, update the database
    const jsonColors = JSON.parse(colorsInput)
    jsonColors.version = jsonColors.version ?? CURRENT_VERSION
    // update database
    await db.colorCommand.update({
      where: { serverId: guildId },
      data: {
        colorsDefault: jsonColors
      }
    })
    return messagesColors.editColorTemplate.success(locale)
  }
})
