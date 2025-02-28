import re from '../regex'
import { z, literal, string, array, object } from 'zod'
import colors from './templete.colorTemplete'

const schemaColorsV1 = object({
  version: literal('v1'),
  colors: array(
    object({
      label: string(),
      hex_color: string().toLowerCase().regex(re.hexColor),
      emoji: string().regex(re.emoji).optional(),
      description: string().optional()
    })
  )
})
// const schemaColors = z.union([schemaColorsV1, schemaColorsV2])

export type ColorsTemplete = z.infer<typeof schemaColorsV1>
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
    const sdata = JSON.parse(s, (k, v) => {
      try {
        return JSON.parse(v)
      } catch (error) {
        return v
      }
    })

    const data = schemaColorsV1.parse(sdata)
    console.log(data)

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
    console.log(error)
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
