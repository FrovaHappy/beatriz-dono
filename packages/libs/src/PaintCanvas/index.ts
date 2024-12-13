import { isShape, isText, type Canvas } from 'src/schemas/schema.welcome.v1'
import paintShape from './paintShape'
import type { Guild, User } from '@type/index'
import paintText from './paintText'

interface PaintCanvasProps {
  ctx: CanvasRenderingContext2D
  canvas: Canvas
  Path2D: typeof Path2D
  images: Record<string, HTMLImageElement>
  filterText: User & Guild
}

export default function paintCanvas(props: PaintCanvasProps) {
  const { ctx, canvas, Path2D, filterText, images } = props
  const { layers, ...base } = canvas
  ctx.clearRect(0, 0, base.w, base.h) // reset canvas in the Frontend
  ctx.save() // save the current state of the canvas
  if (base.bgColor) {
    ctx.fillStyle = base.bgColor
    ctx.fillRect(0, 0, base.w, base.h)
  }
  ctx.restore() // restore the previous state of the canvas
  for (const layer of layers) {
    if (isShape(layer)) paintShape({ ctx, layer, base, Path2D })
    if (isText(layer)) paintText({ ctx, layer, base, filterText })
  }
}

