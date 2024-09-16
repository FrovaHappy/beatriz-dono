import { ModalNames } from '@/const/interactionsNames'
import BuildModal from '@/core/build/BuildModal'
import { ActionRowBuilder, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js'
import z, { ZodError } from 'zod'
import db from '@/core/db'

const schemaEditColorDefaultV1 = z
  .object({
    version: z.literal('v1').optional(),
    values: z.array(z.object({ hexcolor: z.string().regex(/^#([a-f0-9]{6})$/), label: z.string() }).strict())
  })
  .strict()
export type EditColorDefault = z.infer<typeof schemaEditColorDefaultV1>

const textEdit = new TextInputBuilder({
  label: 'Color',
  placeholder: 'Color',
  customId: 'input',
  required: true,
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
    const { guildId } = i
    if (!guildId) return { content: 'No se encontró el guild' }

    // validate JSON color
    let jsonColors: any = i.fields.getTextInputValue('edit-color-default-input')
    try {
      jsonColors = JSON.parse(jsonColors as string)
      if (jsonColors.version === 'v1' || jsonColors.version === undefined) {
        schemaEditColorDefaultV1.parse(jsonColors)
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return { content: 'Error en el json' }
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
