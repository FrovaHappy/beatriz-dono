import { regexEmoji, regexHexColor } from 'regex'
import { z } from 'zod'
import colors from './templete.colorTemplete'

const schemaColorsV1 = z.object({
  version: z.literal('v1'),
  colors: z.array(
    z.object({
      label: z.string().min(1).max(20),
      hex_color: z.string().regex(regexHexColor),
      emoji: z.string().regex(regexEmoji).optional(),
      description: z.string().min(1).max(50).optional()
    })
  )
})
const schemaColors = schemaColorsV1 //z.union([schemaColorsV1, schemaColorsV2])

export type ColorsTemplete = z.infer<typeof schemaColors>
export type ColorsTempleteLatest = z.infer<typeof schemaColorsV1>

const parseToLatest = (data: ColorsTemplete): ColorsTempleteLatest => {
  // if (data.version === 'v1') {
  //   return {
  //     version: 'v2',
  //     colors: data.colors.map(color => ({
  //       label: color.label,
  //       hex_color: color.hexcolor
  //     }))
  //   }
  // }
  if (data.version === 'v1') return data
  throw new Error('Colors Templete version not found')
}

export type validateResult =
  | { error: false; data: ColorsTemplete }
  | { error: true; data: { title: string; description: string } }

export const validate = (s: string): validateResult => {
  try {
    const data = schemaColors.parse(schemaColors.parse(JSON.parse(s)))

    const latest = parseToLatest(data)

    return { error: false, data: latest }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: true,
        data: {
          title: 'Data Invalid',
          description: error.issues.map(issue => `${issue.path.join('.')} -> ${issue.message}`).join('\n')
        }
      }
    }
    return {
      error: true,
      data: {
        title: 'Json failed to parse',
        description: 'Please check the JSON format or contract and try again.'
      }
    }
  }
}

export const COLORS_PLACEHOLDER = colors
