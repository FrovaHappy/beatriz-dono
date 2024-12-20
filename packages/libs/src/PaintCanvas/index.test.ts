import paintCanvas from '.'
import { createCanvas, loadImage, Path2D as Patch } from '@napi-rs/canvas'
import template from './template.welcome'
import { formatterTextUser } from '../formatterText'
import { type Canvas, isShape, MAX_WIDTH_CANVAS, validateCanvas } from './schema.welcome.v1'
import type { Guild, User } from '../types/index'
import fs from 'node:fs/promises'

import { GlobalFonts } from '@napi-rs/canvas'
import { join } from 'node:path'
import { getFonts } from '../getFonts'

beforeEach(async () => {
  console.time('loadFonts')
  const fonts = await getFonts(join('.', 'public/fonts'))
  for (const font of fonts) {
    GlobalFonts.registerFromPath(font.buffer, font.family)
  }
  console.timeEnd('loadFonts')
})

const filterText = {
  userName: 'test',
  userId: '1234567890',
  userDiscriminator: '1234',
  userDisplayName: 'test',
  userAvatar: 'https://i.pinimg.com/736x/d9/ba/9b/d9ba9b2f95bea749bc2c5289087fbdc4.jpg',
  userBanner: 'https://i.pinimg.com/736x/5d/9f/69/5d9f69a552b37e9909f9d825edc56f11.jpg',
  membersCount: '1234567890',
  guildAvatar: 'https://i.pinimg.com/736x/bc/a6/f6/bca6f6362ca065a41699a913ba0cedfe.jpg',
  guildBanner: 'https://i.pinimg.com/736x/02/f7/6b/02f76b4cf0d2ea81ea33e7573d8ef10b.jpg',
  guildName: 'test',
  guildId: '1234567890'
}
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
  return images
}
describe('PaintCanvas', () => {
  it('run test', async () => {
    expect(validateCanvas(template)).toEqual({ ok: true, errors: undefined })
  })
  it('should paint the canvas', async () => {
    const canvas = createCanvas(template.w, template.h)
    const canvasSupport = createCanvas(MAX_WIDTH_CANVAS, MAX_WIDTH_CANVAS)
    const ctx = canvas.getContext('2d')
    const ctxSupport = canvasSupport.getContext('2d')
    const images = await getImages(template.layers, filterText)
    const castColor = '#ff0'
    paintCanvas({
      ctx: ctx as unknown as CanvasRenderingContext2D,
      ctxSupport: ctxSupport as unknown as CanvasRenderingContext2D,
      canvas: template,
      Path2D: Patch as unknown as typeof Path2D,
      images: images,
      filterText,
      castColor
    })
    const imageBuffer = await canvas.encode('png')

    await fs.writeFile('test.png', imageBuffer)

    expect(true).toBe(true)
  })
})