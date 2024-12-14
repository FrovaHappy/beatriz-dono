import type { Text } from '../schemas/schema.welcome.v1'
import type { Guild, User } from '@type/index'
import { formatterTextUser } from '../formatterText'
import { buildFilter } from './buildFilter'

interface PaintTextProps {
  ctx: CanvasRenderingContext2D
  layer: Text
  filterText: User & Guild
}

export default function paintText(options: PaintTextProps) {
  const { ctx, layer, filterText } = options

  let text = formatterTextUser(layer.text, filterText)
  ctx.save() // save the current state of the canvas
  let widthText = ctx.measureText(text).width

  if (layer.maxWidth !== 0 && layer.maxWidth) {
    while (widthText > layer.maxWidth || widthText < 0) {
      text = text.slice(0, -1)
      widthText = ctx.measureText(text).width
    }
    text += '...'
  }
  // Global Settings
  ctx.globalAlpha = layer.globalAlpha ?? 1
  ctx.font = `${layer.weight} ${layer.size}px ${layer.family}`
  ctx.textAlign = layer.align
  ctx.textBaseline = layer.baseline
  ctx.fillStyle = layer.color

  const filter = buildFilter(layer.filter)
  if (filter) ctx.filter = filter

  ctx.fillText(text, layer.dx, layer.dy)

  ctx.restore() // restore the previous state of the canvas
  return ctx
}
