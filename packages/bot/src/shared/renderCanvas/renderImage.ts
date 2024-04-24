import { type Base, type Image, type TextBase } from '@/types/Canvas.types'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function renderImage(
  image: Image,
  ctx: CanvasRenderingContext2D,
  base: Base & TextBase,
  loadImage: (k: string) => Promise<HTMLImageElement>
) {
  const { x, y, height, width, img, color } = image
  ctx.save()
  ctx.fillStyle = color ?? 'transparent'
  ctx.fillRect(x, y, width, height)
  if (img) ctx.drawImage(await loadImage(img), x, y, width, height)
  ctx.restore()
}
