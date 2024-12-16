import type { Shape } from './schema.welcome.v1'

interface PaintShapeProps {
  ctx: CanvasRenderingContext2D
  layer: Shape
  image: HTMLImageElement | undefined
  castColor: string | undefined
  Path2D: typeof Path2D
}

export default function paintShape(props: PaintShapeProps) {
  const { ctx, layer, Path2D, image, castColor } = props
  const color = !!castColor && layer.color === 'auto' ? castColor : layer.color
  const patch = layer.clip
  ctx.save()

  const dimension = {
    h: layer.dh ?? image?.height ?? 100,
    w: layer.dw ?? image?.width ?? 100
  }
  ctx.translate(layer.dx, layer.dy) // move the position of the image
  const minImage = Math.min(dimension.w, dimension.h)
  const scaleTo = minImage / Math.max(patch?.w ?? minImage, patch?.h ?? minImage)
  const center = {
    h: ((patch?.h ?? dimension.h) - dimension.h / scaleTo) / 2,
    w: ((patch?.w ?? dimension.w) - dimension.w / scaleTo) / 2
  }

  if (patch) {
    // calculate the scale of the image
    ctx.scale(scaleTo, scaleTo)
    ctx.clip(new Path2D(patch.d))
  }
  // setting
  ctx.fillStyle = color

  if (layer.color !== 'transparent') ctx.fillRect(0, 0, dimension.w, dimension.h)
  if (image) ctx.drawImage(image, center.w, center.h, dimension.w / scaleTo, dimension.h / scaleTo)

  ctx.transform(1, 0, 0, 1, 0, 0) // reset the transformation matrix to the identity matrix

  ctx.restore()
}
