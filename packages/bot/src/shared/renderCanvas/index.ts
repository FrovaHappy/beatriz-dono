import type { Base, Layer, Text, TextBase, User, Image, Icon } from '@/types/Canvas.types'
import { renderText } from './renderText'
import { renderImage } from './renderImage'
import { renderIcon } from './renderIcon'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async function renderCanvas(
  layers: Layer[],
  base: Base & TextBase,
  user: User,
  ctx: CanvasRenderingContext2D,
  Path2DInstance: typeof Path2D,
  loadImage: (path: string) => Promise<HTMLImageElement>
) {
  ctx.clearRect(0, 0, base.width, base.height)
  ctx.save()
  if (base.color) {
    ctx.fillStyle = base.color
    ctx.fillRect(0, 0, base.width, base.height)
  }
  ctx.restore()
  for (const layer of layers) {
    switch (layer.type) {
      case 'text':
        renderText(layer as Text, ctx, user, base)
        break
      case 'image':
        await renderImage(layer as Image, ctx, base, loadImage)
        break
      case 'icon':
        await renderIcon(layer as Icon, ctx, base, Path2DInstance, loadImage)
        break
    }
  }
  return ctx
}
