import type { Text, Image, Icon, Canvas, Layer } from '@/types/Canvas.types'
import { type ZodType, any, array, literal, number, object, string, union } from 'zod'
import validate from '../../shared/validate'
const LIMIT_NUMBER = 1024
const URL_IMAGE = /^https:\/\/(imgur.com|media.discordapp.net)\b([-a-zA-Z0-9()!@:%_+.~#?&//=]*)$/
const COLOR = string()
  .regex(/^(#[a-fA-F0-9]{6}|transparent)$/, 'required hex valid with six numbers')
  .optional()

const CoordinateSchema = object({
  x: number().min(0).max(LIMIT_NUMBER),
  y: number().min(0).max(LIMIT_NUMBER)
})

const LayerSchema = object({
  type: union([literal('icon'), literal('text'), literal('image')]),
  id: number().positive()
}).strict()
const BaseSchema = object({
  color: COLOR,
  height: number().positive().max(LIMIT_NUMBER),
  width: number().positive().max(LIMIT_NUMBER)
}).strict()

const TextBaseSchema = object({
  size: number().positive().max(LIMIT_NUMBER),
  color: COLOR,
  family: string(),
  weight: number().positive().max(1000),
  limitLetters: number().int().min(0).max(LIMIT_NUMBER),
  content: string(),
  align: union([literal('start'), literal('end'), literal('left'), literal('right'), literal('center')]),
  baseline: union([
    literal('top'),
    literal('hanging'),
    literal('middle'),
    literal('alphabetic'),
    literal('ideographic'),
    literal('bottom')
  ])
}).strict()

const ImageBaseSchema = object({
  img: string().url().regex(URL_IMAGE)
}).strict()
const IconBaseSchema = object({
  shape: union([
    literal('square'),
    literal('square5'),
    literal('square10'),
    literal('square15'),
    literal('square20'),
    literal('circle')
  ])
}).strict()

export const imageZod: ZodType<Layer<Image>> = LayerSchema.merge(ImageBaseSchema)
  .merge(CoordinateSchema)
  .merge(BaseSchema)
  .strict()
export const iconZod: ZodType<Layer<Icon>> = LayerSchema.merge(IconBaseSchema)
  .merge(CoordinateSchema)
  .merge(BaseSchema)
  .strict()
export const textZod: ZodType<Layer<Text>> = TextBaseSchema.merge(CoordinateSchema).merge(LayerSchema).strict()

const canvasSchema = object({
  layers: array(any()).min(0).max(10)
}).strict()

export const canvasZod: ZodType<Canvas> = canvasSchema.merge(BaseSchema).strict()

const types: Record<string, ZodType> = {
  text: textZod,
  icon: iconZod,
  image: imageZod
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function validateCanvas(data: any) {
  const invalidObj = validate(data ?? {}, canvasZod) ?? false
  if (invalidObj) return invalidObj
  for (const layer of data.layers) {
    const typeZod = types[layer.type] ?? null
    const invalidLayer = validate(layer, typeZod)
    if (invalidLayer) return invalidLayer
  }
}
