import { ModalNames } from '@/const/interactionsNames'
import BuildModal from '@/core/build/BuildModal'
import db from '@/core/db'
import { ActionRowBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import { validate } from './schema.color'

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
  resolve: 'defer',
  data: new ModalBuilder({ title: 'Edit Color Default' }).addComponents(rows),
  permissions: [],
  async execute(i) {
    const currentVersion = 'v1'
    const { guildId } = i
    if (!guildId) return { content: 'No se encontró el guild' }

    // validate JSON color
    const colorsInput = i.fields.getTextInputValue('input')
    const errorColors = validate(colorsInput)
    if (errorColors) return { content: errorColors }

    // if the json is valid, update the database
    const jsonColors = JSON.parse(colorsInput)
    jsonColors.version = jsonColors.version ?? currentVersion
    // update database
    await db.colorCommand.update({
      where: { serverId: guildId },
      data: {
        colorsDefault: jsonColors
      }
    })
    return { content: 'edit Color Default' }
  }
})
