import { ZodError, z } from 'zod'
import { type FontsFamily, fontsFamily } from '../getFonts'
import re from '../regex'

export const MAX_WIDTH_CANVAS = 2000

const validateColor = z.union([
  z.string().refine((val: string) => re.hexColor.test(val), 'the format has to be #RGB or #RRGGBB'),
  z.literal('transparent')
])

const filterSchema = z.object({
  blur: z.number().min(0).max(100).optional(),
  brightness: z.number().min(-100).max(100).optional(),
  contrast: z.number().min(-100).max(100).optional(),
  dropShadow: z
    .object({
      offsetX: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
      offsetY: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
      blurRadius: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
      color: validateColor
    })
    .optional(),
  grayscale: z.number().min(0).max(100).optional(),
  hueRotate: z.number().min(-360).max(360).optional(),
  invert: z.number().min(0).max(100).optional(),
  opacity: z.number().min(0).max(100).optional(),
  saturate: z.number().min(-100).max(100).optional(),
  sepia: z.number().min(0).max(100).optional()
})
/* Features Futures
  - support for gradient
*/
const textSchema = z.object({
  id: z.string().min(1).max(100),
  type: z.literal('text'),
  dx: z.number().min(0).max(MAX_WIDTH_CANVAS),
  dy: z.number().min(0).max(MAX_WIDTH_CANVAS),
  text: z.string().min(1).max(MAX_WIDTH_CANVAS),
  size: z
    .number()
    .min(10)
    .max(MAX_WIDTH_CANVAS * 3)
    .optional(),
  family: z.custom<FontsFamily>(val => fontsFamily.some(f => f === val), 'This Font is not available'),
  color: z.union([validateColor, z.literal('auto')]).optional(),
  globalAlpha: z.number().min(0).max(1).multipleOf(0.01).optional(),
  letterSpacing: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
  maxWidth: z.number().min(1).max(MAX_WIDTH_CANVAS).optional(),
  weight: z.number().min(200).max(1000).step(100).optional(),
  align: z
    .union([z.literal('start'), z.literal('end'), z.literal('left'), z.literal('right'), z.literal('center')])
    .optional(),
  baseline: z
    .union([
      z.literal('top'),
      z.literal('hanging'),
      z.literal('middle'),
      z.literal('alphabetic'),
      z.literal('ideographic'),
      z.literal('bottom')
    ])
    .optional(),
  filter: filterSchema.optional()
})
const reUrlImage = re.buildUrlImage(['imgur.com', 'media.discordapp.net', 'i.pinimg.com'])
const shapeSchema = z
  .object({
    id: z.string().min(1).max(100),
    type: z.literal('shape'),
    color: z.union([validateColor, z.literal('auto')]).optional(),
    dx: z.number().min(0).max(MAX_WIDTH_CANVAS),
    dy: z.number().min(0).max(MAX_WIDTH_CANVAS),
    dh: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
    dw: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
    image: z
      .union([
        z.string().url().regex(reUrlImage),
        z.literal('{{user_avatar}}'),
        z.literal('{{user_banner}}'),
        z.literal('{{server_avatar}}'),
        z.literal('{{server_banner}}')
      ])
      .optional(),
    imageSmoothingEnabled: z.boolean().optional(), // TODO: for implement
    imageSmoothingQuality: z.union([z.literal('low'), z.literal('medium'), z.literal('high')]).optional(), // TODO: for implement
    clip: z
      .object({
        d: z.string().regex(re.dispatch),
        h: z.number().min(1).max(MAX_WIDTH_CANVAS),
        w: z.number().min(1).max(MAX_WIDTH_CANVAS),
        align: z
          .union([
            z.literal('top'),
            z.literal('left'),
            z.literal('right'),
            z.literal('center'),
            z.literal('button'),
            z.literal('top-left'),
            z.literal('top-right'),
            z.literal('bottom-left'),
            z.literal('bottom-right')
          ])
          .optional()
      })
      .strict()
      .optional(),
    filter: filterSchema.optional()
  })
  .strict()

const canvasSchema = z.object({
  id: z.string().min(10).max(100).optional(),
  version: z.literal('1'),
  title: z.string().min(1).max(100),
  author: z.string().min(10).max(100),
  forkedFrom: z.string().min(1).max(100).optional(),
  visible: z.boolean().optional(),
  h: z.number().min(0).max(MAX_WIDTH_CANVAS),
  w: z.number().min(0).max(MAX_WIDTH_CANVAS),
  bgColor: validateColor.optional(),
  layerCastColor: z.string().optional(),
  layers: z.array(z.union([textSchema, shapeSchema]))
})
export type Canvas = z.infer<typeof canvasSchema>
export type Text = z.infer<typeof textSchema>
export type Shape = z.infer<typeof shapeSchema>
export type Filter = z.infer<typeof filterSchema>

export function isText(layer: Text | Shape): layer is Text {
  return layer.type === 'text'
}
export function isShape(layer: Text | Shape): layer is Shape {
  return layer.type === 'shape'
}

export function validateCanvas(data: any) {
  try {
    canvasSchema.parse(data)
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      errors: error instanceof ZodError ? error.errors : undefined
    }
  }
  return {
    ok: true,
    errors: undefined
  }
}
