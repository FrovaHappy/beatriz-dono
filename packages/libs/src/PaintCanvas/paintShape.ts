import { buildFilter } from './buildFilter'
import type { Shape } from './schema.welcome.v1'

interface PaintShapeProps {
  ctx: CanvasRenderingContext2D
  ctxSupport: CanvasRenderingContext2D
  layer: Shape
  image: HTMLImageElement | undefined
  castColor: string | undefined
  Path2D: typeof Path2D
}

export default function paintShape(props: PaintShapeProps) {
  const { ctx, ctxSupport, layer, Path2D, image, castColor } = props
  const color = !!castColor && layer.color === 'auto' ? castColor : layer.color
  const patch = layer.clip
  const filter = buildFilter(layer.filter)
  ctx.save()

  // obtain dimensions and scale of the image
  const dimension = {
    h: layer.dh ?? image?.height ?? 100,
    w: layer.dw ?? image?.width ?? 100
  }

  const renderImage = () => {
    if (!patch) return null
    const { width: dataWidth, height: dataHeight } = ctxSupport.canvas
    const maxPatch = Math.max(patch.w, patch.h)
    ctxSupport.save()
    ctxSupport.fillStyle = color
    ctxSupport.scale(dataWidth / maxPatch, dataHeight / maxPatch)
    ctxSupport.clip(new Path2D(patch.d))
    ctxSupport.fillRect(0, 0, patch.w, patch.h)
    if (image) ctxSupport.drawImage(image, 0, 0, patch.w, patch.h)
    ctxSupport.restore()
    return ctxSupport.canvas
  }
  const imageCanvas = renderImage()

  if (filter) ctx.filter = filter
  console.log(layer.dx, layer.dy)
  ctx.translate(layer.dx, layer.dy)
  if (imageCanvas) ctx.drawImage(imageCanvas, 0, 0, dimension.w, dimension.h)
  else {
    ctx.fillStyle = color
    ctx.fillRect(0, 0, dimension.w, dimension.h)
    if (image) ctx.drawImage(image, 0, 0, dimension.w, dimension.h)
  }

  ctx.restore()
}
