import paintCanvas from './PaintCanvas'
import { type Canvas, isShape } from '@libs/schemas/welcome.v1'
import { formatterTextUser } from '@libs/formatterText'
import { getPallete } from '@libs/colors'
import type { Guild, User } from '@libs/types'
import fonts from '@libs/constants/fonts'

export const getCssFonts = () => {
  let cssFont = ''
  for (const [key, value] of Object.entries(fonts)) {
    cssFont += `
    @font-face {
      font-family: '${key}';
      src: url('${value.src}') format('${value.format}');
      font-weight: ${value.variable ? '100' : '300 800'};
      font-style: normal;
    }
    `
  }
  const cssText = `
    <style type="text/css" rel="preload" id="fonts">
      ${cssFont}
    </style>
  `
  return cssText
}

export const filterTextExample = {
  userName: 'userName',
  userId: '1234567890',
  userDiscriminator: '1234',
  userDisplayName: 'userName',
  userAvatar: 'https://i.pinimg.com/236x/3c/6c/cb/3c6ccb83716d1e4fb91d3082f6b21d77.jpg',
  userBanner: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsYWH3wSTqHXtfxqiXba2GpwxoBxyZDhfJ1g&s',
  membersCount: '343',
  guildAvatar: 'https://i.pinimg.com/474x/a2/26/c4/a226c48e2fae2c466194df90069299e7.jpg',
  guildBanner: 'https://i.pinimg.com/236x/06/35/bf/0635bf6e3bbbe6d85b0f167c3ade5614.jpg',
  guildName: 'Server Name',
  guildId: '46234567890'
}

const getImages = async (layers: Canvas['layers'], filterText: User & Guild) => {
  const images: Record<string, HTMLImageElement> = {}
  const resolveImages = []
  const buildImage = (url: string) =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = url
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('Failed to load image'))
    })
  for (const layer of layers) {
    if (!isShape(layer)) continue
    resolveImages.push(async () => {
      if (!layer.image) return
      const url = formatterTextUser(layer.image, filterText)
      images[layer.id] = (await buildImage(url)) as unknown as HTMLImageElement
    })
  }

  await Promise.allSettled(resolveImages.map(fn => fn()))
  return images
}

const getCastColor = (images: Record<string, HTMLImageElement>, castColor: string | undefined) => {
  if (!castColor) return undefined
  const image = images[castColor]
  if (!image) return undefined

  // Create a temporary canvas to get the image data
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = image.width
  tempCanvas.height = image.height
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) return undefined

  // Draw the image and get its data
  tempCtx.drawImage(image, 0, 0)
  const imageData = tempCtx.getImageData(0, 0, image.width, image.height)

  return getPallete({ data: imageData.data, length: 1 })[0]
}

type GenerateImageProps = {
  template: Canvas
  filterText: User & Guild
  quality?: number
}

export async function generateImage(props: GenerateImageProps) {
  const { template, filterText } = props
  const canvas = document.createElement('canvas')
  canvas.width = template.w
  canvas.height = template.h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get context')

  const images = await getImages(template.layers, filterText)
  const castColor = getCastColor(images, template.layer_cast_color)
  paintCanvas({ ctx, canvas: template, Path2D, filterText, images, castColor })
  return canvas
}
