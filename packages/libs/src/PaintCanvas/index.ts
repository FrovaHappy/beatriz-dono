import type { Guild, User } from '@libs/types'
import paintShape from './paintShape'
import paintText from './paintText'
import { type Canvas, isShape, isText } from './schema.welcome.v1'

interface PaintCanvasProps {
  ctx: CanvasRenderingContext2D
  ctxSupport: CanvasRenderingContext2D
  canvas: Canvas
  Path2D: typeof Path2D
  images: Record<string, HTMLImageElement | undefined>
  filterText: User & Guild
  castColor: string | undefined
}
/**
 * Props.images is a Record<[id: sting], HTMLImageElement | undefined>
 */
export default function paintCanvas(props: PaintCanvasProps) {
  const { ctx, canvas, Path2D, filterText, images, castColor, ctxSupport } = props
  const { layers, ...base } = canvas
  ctx.clearRect(0, 0, base.w, base.h) // reset canvas in the Frontend
  ctxSupport.clearRect(0, 0, base.w, base.h) // reset canvas in the Frontend
  ctx.save()
  if (base.bg_color) {
    // save the current state of the canvas
    ctx.fillStyle = !!castColor && base.bg_color === 'auto' ? castColor : base.bg_color
    ctx.fillRect(0, 0, base.w, base.h)
  }
  ctx.restore() // restore the previous state of the canvas
  for (const layer of layers) {
    if (isShape(layer)) paintShape({ ctx, ctxSupport, layer, Path2D, image: images[layer.id], castColor })
    if (isText(layer)) paintText({ ctx, layer, filterText, castColor })
  }
  return ctx
}
