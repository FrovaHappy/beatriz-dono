// ************ IMPORTANT ************
// This file is used to the backend of the bot
// It is not used in the frontend, it show a error

import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import paintCanvas from '@libs/PaintCanvas'
import getPallete from '@libs/palette-generator'
import fonts from '@libs/constants/fonts'
import { formatterTextUser } from '@libs/formatterText'
import { type Canvas, isShape } from '@libs/schemas/welcome.v1'
import type { Guild, User } from '@libs/types'
import { Path2D as Patch, createCanvas, loadImage } from '@napi-rs/canvas'

export const getFonts = async (root: string) => {
  if (!existsSync(root)) await mkdir(root, { recursive: true })
  const getterFonts = []
  for (const [key, value] of Object.entries(fonts)) {
    const path = join(root, `/${key.replaceAll(' ', '-')}.${value.format}`)
    if (!existsSync(path)) {
      const font = (await fetch(value.src)).body
      const buffer = await new Response(font).arrayBuffer()
      const dataView = new DataView(buffer)
      await writeFile(path, dataView)
    }

    getterFonts.push({
      family: key,
      buffer: path,
      format: value.format,
      variable: value.variable,
    })
  }
  return getterFonts
}

export const getImageData = async (url: string | null) => {
  if (!url) return null

  const data = await loadImage(url, { requestOptions: { timeout: 10_000 } }).catch(_e => null)
  if (!data) return null
  const canvas = createCanvas(data.width, data.height)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(data, 0, 0, data.width, data.height)
  const imageData = ctx.getImageData(0, 0, data.width, data.height)
  return imageData
}

/**
 *
 * @param layers the layers of the canvas
 * @param filterText the filter text
 * @returns an record of images with the id of the layer as key and the image as value
 */
const getImages = async (layers: Canvas['layers'], filterText: User & Guild) => {
  const images: Record<string, HTMLImageElement> = {}
  const resolveImages = []
  for (const layer of layers) {
    if (!isShape(layer)) continue
    resolveImages.push(async () => {
      if (!layer.image) return
      const url = formatterTextUser(layer.image, filterText)
      images[layer.id] = (await loadImage(url)) as unknown as HTMLImageElement
    })
  }
  await Promise.allSettled(resolveImages.map(fn => fn()))
  return { images }
}
type GenerateImageProps = {
  template: Canvas
  filterText: User & Guild
  quality?: number
}
export async function generateImage(props: GenerateImageProps) {
  const { template, filterText, quality = 100 } = props
  const canvas = createCanvas(template.w, template.h)
  const ctx = canvas.getContext('2d')
  const { images } = await getImages(template.layers, filterText)
  const imageData = await getImageData(images[`${template.layer_cast_color}`]?.src)
  const castColor = template.layer_cast_color
    ? getPallete({ data: imageData?.data ?? null })
    : undefined
  paintCanvas({
    ctx: ctx as unknown as CanvasRenderingContext2D,
    canvas: template,
    Path2D: Patch as unknown as typeof Path2D,
    images: images,
    filterText,
    castColor: castColor?.[0],
  })
  const imageBuffer = await canvas.encode('webp', quality)
  return imageBuffer
}
