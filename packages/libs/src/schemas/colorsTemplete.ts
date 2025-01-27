import { regexEmoji, regexHexColor } from 'regex'
import { z } from 'zod'

const schemaColorsV1 = z.object({
  version: z.literal('v1'),
  colors: z.array(z.object({ hexcolor: z.string().regex(regexEmoji), label: z.string() }))
})

const schemaColorsV2 = z.object({
  version: z.literal('v2'),
  colors: z.array(
    z.object({
      label: z.string(),
      hex_color: z.string().regex(regexHexColor),
      emoji: z.string().regex(regexEmoji).optional()
    })
  )
})
export const schemaColors = z.union([schemaColorsV1, schemaColorsV2])
export type ColorsTemplete = z.infer<typeof schemaColors>

type ColorsTempleteLatest = z.infer<typeof schemaColorsV2>

export const isVersionLatest = (data: ColorsTemplete): data is ColorsTempleteLatest => {
  const colors: ColorsTempleteLatest['colors'] = []
  if (data.version === 'v1') {
    for (const color of data.colors) {
      colors.push({
        label: color.label,
        hex_color: color.hexcolor
      })
    }
  }
  return data.version === 'v2'
}