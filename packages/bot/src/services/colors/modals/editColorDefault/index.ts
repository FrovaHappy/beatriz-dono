import { ModalNames } from '@/const/interactionsNames'
import BuildModal from '@/core/build/BuildModal'
import { ActionRowBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import z, { ZodError } from 'zod'
import db from '@/core/db'

const COLORS_PLACEHOLDER = `
{
  "version": "v1",
  "values": [
    {
      "hexcolor": "#000000",
      "label": "Black"
    },
    {
      "hexcolor": "#ffffff",
      "label": "White"
    }
  ]
}
`

const schemaEditColorDefault = {
  v1: z.array(z.object({ hexcolor: z.string().regex(/^#([a-f0-9]{6})$/), label: z.string() }).strict())
}
type ColorValuesV1 = z.infer<(typeof schemaEditColorDefault)['v1']>

export interface EditColorDefault {
  version: keyof typeof schemaEditColorDefault
  values: ColorValuesV1
}

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
  data: new ModalBuilder({ title: 'Edit Color Default' }).addComponents(rows),
  permissions: [],
  async execute(i) {
    const currentVersion = 'v1'
    const { guildId } = i
    if (!guildId) return { content: 'No se encontró el guild' }

    // validate JSON color
    const colorsInput: any = i.fields.getTextInputValue('input')
    let jsonColors: Record<string, any>
    try {
      const { version, values } = JSON.parse(colorsInput as string)
      schemaEditColorDefault[(version as keyof typeof schemaEditColorDefault) ?? currentVersion].parse(values)
      jsonColors = { version: version ?? currentVersion, values }
    } catch (error) {
      if (error instanceof ZodError) {
        return { content: 'Error en el json: ' + JSON.stringify(error.errors) }
      }
      return { content: 'El json no es valido' }
    }

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
