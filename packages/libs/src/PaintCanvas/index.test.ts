import fs from 'node:fs/promises'
import { Path2D as Patch, createCanvas, loadImage } from '@napi-rs/canvas'
import paintCanvas from '.'
import { formatterTextUser } from '../formatterText'
import type { Guild, User } from '../types/index'
import { type Canvas, MAX_WIDTH_CANVAS, isShape, validateCanvas } from './schema.welcome.v1'
import template from './template.welcome'
import dataUri from './imagesDataUri'

import { join } from 'node:path'
import { GlobalFonts } from '@napi-rs/canvas'
import { getFonts } from '../getFonts'
import { getPallete, rgbToHex } from 'colors'
import { getImageData } from '../server'

beforeEach(async () => {
  console.time('loadFonts')
  const fonts = await getFonts(join('.', 'public/fonts'))
  for (const font of fonts) {
    GlobalFonts.registerFromPath(font.buffer, font.family)
  }
  console.timeEnd('loadFonts')
})

const filterText = {
  userName: 'userName',
  userId: '1234567890',
  userDiscriminator: '1234',
  userDisplayName: 'userName',
  userAvatar: dataUri.userAvatar,
  userBanner: dataUri.userBanner,
  membersCount: '343',
  guildAvatar: dataUri.guildAvatar,
  guildBanner: dataUri.guildBanner,
  guildName: 'Server Name',
  guildId: '46234567890'
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
    const data = (await getImageData(dataUri.userAvatar))?.data ?? null
    console.log(Number(template.layer_cast_color))
    const castColor = getPallete({
      data,
      format: 'hex'
    })
    paintCanvas({
      ctx: ctx as unknown as CanvasRenderingContext2D,
      ctxSupport: ctxSupport as unknown as CanvasRenderingContext2D,
      canvas: template,
      Path2D: Patch as unknown as typeof Path2D,
      images: images,
      filterText,
      castColor: castColor[0] as string
    })
    const imageBuffer = await canvas.encode('webp', 100)

    await fs.writeFile('test.webp', imageBuffer)

    expect(true).toBe(true)
  })
})
