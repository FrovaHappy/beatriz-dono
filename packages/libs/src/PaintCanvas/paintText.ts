import type { Guild, User } from '@libs/types'
import { formatterTextUser } from '../formatterText'
import { buildFilter } from './buildFilter'
import type { Text } from './schema.welcome.v1'

interface PaintTextProps {
  ctx: CanvasRenderingContext2D
  layer: Text
  filterText: User & Guild
  castColor: string | undefined
}

export default function paintText(options: PaintTextProps) {
  const { ctx, layer, filterText, castColor } = options
  const color = !!castColor && layer.color === 'auto' ? castColor : layer.color
  let text = formatterTextUser(layer.text, filterText)
  ctx.save() // save the current state of the canvas
  let widthText = ctx.measureText(text).width

  if (layer.maxWidth !== 0 && layer.maxWidth) {
    while (widthText > layer.maxWidth || widthText < 0) {
      text = text.slice(0, -1)
      widthText = ctx.measureText(text).width
    }
  }
  // Global Settings
  ctx.globalAlpha = layer.globalAlpha ?? 1
  ctx.font = `${layer.weight} ${layer.size}px ${layer.family}`
  ctx.textAlign = layer.align ?? 'start'
  ctx.textBaseline = layer.baseline ?? 'alphabetic'
  ctx.fillStyle = color ?? '#000'

  const filter = buildFilter(layer.filter)
  if (filter) ctx.filter = filter

  ctx.fillText(text, layer.dx, layer.dy)

  ctx.restore() // restore the previous state of the canvas
  return ctx
}
