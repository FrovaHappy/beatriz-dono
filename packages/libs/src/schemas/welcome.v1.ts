import { fontsFamily } from '@libs/constants/fonts'
import { ZodError, z } from 'zod'
import re from '../regex'

export const MAX_WIDTH_CANVAS = 2000
export const LAST_VERSION = '1'
const reUrlImage = re.buildUrlImage(['imgur.com', 'media.discordapp.net', 'i.pinimg.com'])
const validateColor = z.union([
  z.string().refine((val: string) => re.hexColor.test(val), 'the format has to be #RGB or #RRGGBB'),
  z.literal('transparent'),
])

const filterSchema = z.object({
  blur: z.number().min(0).step(1).max(100).optional(),
  brightness: z.number().step(1).min(-100).max(100).optional(),
  contrast: z.number().step(1).min(-100).max(100).optional(),
  dropShadow: z
    .object({
      offsetX: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
      offsetY: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
      blurRadius: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
      color: validateColor,
    })
    .optional(),
  grayscale: z.number().step(1).min(0).max(100).optional(),
  hueRotate: z.number().step(1).min(-360).max(360).optional(),
  invert: z.number().step(1).min(0).max(100).optional(),
  opacity: z.number().step(1).min(0).max(100).optional(),
  saturate: z.number().step(1).min(-100).max(100).optional(),
  sepia: z.number().step(1).min(0).max(100).optional(),
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
    .optional()
    .default(16),
  family: z.custom<string>(val => fontsFamily.some(f => f === val), 'This Font is not available'),
  color: z.union([validateColor, z.literal('auto')]).optional(),
  globalAlpha: z.number().min(0).max(1).multipleOf(0.01).optional().default(1),
  letterSpacing: z.number().min(0).max(MAX_WIDTH_CANVAS).optional().default(0),
  maxWidth: z.number().min(1).max(MAX_WIDTH_CANVAS).optional(),
  weight: z.number().min(200).max(1000).step(100).optional().default(400),
  align: z
    .union([
      z.literal('start'),
      z.literal('end'),
      z.literal('left'),
      z.literal('right'),
      z.literal('center'),
    ])
    .optional()
    .default('start'),
  baseline: z
    .union([
      z.literal('top'),
      z.literal('hanging'),
      z.literal('middle'),
      z.literal('alphabetic'),
      z.literal('ideographic'),
      z.literal('bottom'),
    ])
    .optional()
    .default('alphabetic'),
  filter: filterSchema.optional(),
})
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
        z.literal('{{server_banner}}'),
      ])
      .optional(),
    // imageSmoothingEnabled: z.boolean().optional(), // TODO: for implement
    // imageSmoothingQuality: z.union([z.literal('low'), z.literal('medium'), z.literal('high')]).optional(), // TODO: for implement
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
            z.literal('bottom-right'),
          ])
          .optional(),
      })
      .strict()
      .optional(),
    filter: filterSchema.optional(),
  })
  .strict()

const canvasSchema = z.object({
  id: z.string().min(10).max(100).optional(),
  version: z.literal('1'),
  title: z.string().min(1).max(100),
  author: z.string().min(10).max(100).optional(),
  forked: z.string().min(1).max(100).optional(),
  visibility: z.union([z.literal('public'), z.literal('private')]).optional(),
  h: z.number().min(0).max(MAX_WIDTH_CANVAS),
  w: z.number().min(0).max(MAX_WIDTH_CANVAS),
  bg_color: validateColor.optional(),
  layer_cast_color: z.string().optional(),
  layers: z.array(z.union([textSchema, shapeSchema])).max(50),
})

// this canvas type is used to validate the canvas data input from the user
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
  let canvas: Canvas | null = null
  try {
    canvas = canvasSchema.parse(data)
  } catch (error) {
    return {
      ok: false,
      errors: error instanceof ZodError ? error.errors : undefined,
      data: null,
    }
  }
  return {
    ok: true,
    errors: undefined,
    data: canvas,
  }
}
