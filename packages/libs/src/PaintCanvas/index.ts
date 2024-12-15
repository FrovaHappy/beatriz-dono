import { isShape, isText, type Canvas } from './schema.welcome.v1'
import paintShape from './paintShape'
import type { Guild, User } from '@type/index'
import paintText from './paintText'

interface PaintCanvasProps {
  ctx: CanvasRenderingContext2D
  canvas: Canvas
  Path2D: typeof Path2D
  images: Record<string, HTMLImageElement | undefined>
  filterText: User & Guild
}
/**
 * Props.images is a Record<[id: sting], HTMLImageElement | undefined>
 */
export default function paintCanvas(props: PaintCanvasProps) {
  console.time('paintCanvas')
  const { ctx, canvas, Path2D, filterText, images } = props
  const { layers, ...base } = canvas
  ctx.clearRect(0, 0, base.w, base.h) // reset canvas in the Frontend
  ctx.save()
  if (base.bgColor) {
    // save the current state of the canvas
    ctx.fillStyle = base.bgColor
    ctx.fillRect(0, 0, base.w, base.h)
  }
  ctx.restore() // restore the previous state of the canvas
  console.log('render base')
  for (const layer of layers) {
    if (isShape(layer)) paintShape({ ctx, layer, base, Path2D, image: images[layer.id] })
    if (isText(layer)) paintText({ ctx, layer, filterText })
  }
  console.timeEnd('paintCanvas')
  return ctx
}
