import type { Base, Image, TextBase } from '@type/Canvas'

export async function renderImage(
  image: Image,
  ctx: CanvasRenderingContext2D,
  base: Base & TextBase,
  img: HTMLImageElement
) {
  const { x, y, height, width, color } = image
  ctx.save()
  ctx.fillStyle = color ?? 'transparent'
  ctx.fillRect(x, y, width, height)
  if (img) ctx.drawImage(img, x, y, width, height)
  ctx.restore()
}
