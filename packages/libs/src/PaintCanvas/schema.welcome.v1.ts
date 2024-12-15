import { type FontsFamily, fontsFamily } from '../getFonts'
import { z, ZodError } from 'zod'

const MAX_WIDTH_CANVAS = 2000

const regex = {
  hexColor: /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/,
  patch: /^([mxywhcvzsqtalMXYWHCVZSQTAL0-9 ,.-]+)$/,
  urlImage: () => {
    const domains = ['imgur.com', 'media.discordapp.net', 'i.pinimg.com']
    return new RegExp(`^https?://${domains.join('|')}/\\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)$`)
  }
}
const validateColor = z.union([
  z.string().refine((val: string) => regex.hexColor.test(val), 'the format has to be #RGB or #RRGGBB'),
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
  family: z.string().refine(val => fontsFamily.some(f => f === val), 'This Font is not available'),
  color: z.union([validateColor, z.literal('auto')]).default('#000'),
  globalAlpha: z.number().min(0).max(1).multipleOf(0.01).optional(),
  letterSpacing: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
  maxWidth: z.number().min(1).max(MAX_WIDTH_CANVAS).optional(),
  weight: z.number().min(200).max(1000).step(100).optional(),
  align: z.union([z.literal('start'), z.literal('end'), z.literal('left'), z.literal('right'), z.literal('center')]),
  baseline: z.union([
    z.literal('top'),
    z.literal('hanging'),
    z.literal('middle'),
    z.literal('alphabetic'),
    z.literal('ideographic'),
    z.literal('bottom')
  ]),
  filter: filterSchema.optional()
})

const shapeSchema = z
  .object({
    id: z.string().min(1).max(100),
    type: z.literal('shape'),
    color: z.union([validateColor, z.literal('auto')]).default('transparent'),
    dx: z.number().min(0).max(MAX_WIDTH_CANVAS),
    dy: z.number().min(0).max(MAX_WIDTH_CANVAS),
    dh: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
    dw: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
    sx: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
    sy: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
    sw: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
    sh: z.number().min(0).max(MAX_WIDTH_CANVAS).optional(),
    image: z
      .union([
        z.string().url().regex(regex.urlImage()),
        z.literal('{{user_avatar}}'),
        z.literal('{{user_banner}}'),
        z.literal('{{server_avatar}}'),
        z.literal('{{server_banner}}')
      ])
      .optional(),
    imageSmoothingEnabled: z.boolean().default(true),
    imageSmoothingQuality: z.union([z.literal('low'), z.literal('medium'), z.literal('high')]).default('low'),
    clip: z
      .object({
        d: z.string().regex(regex.patch),
        h: z.number().min(0).max(1),
        w: z.number().min(0).max(1)
      })
      .strict()
      .optional(),
    filter: filterSchema.optional()
  })
  .strict()

const canvasSchema = z.object({
  version: z.literal('1').default('1'),
  title: z.string().min(1).max(100),
  h: z.number().min(0).max(MAX_WIDTH_CANVAS),
  w: z.number().min(0).max(MAX_WIDTH_CANVAS),
  bgColor: validateColor.default('transparent'),
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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
