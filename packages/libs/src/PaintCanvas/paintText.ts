import type { Canvas, Text } from 'src/schemas/schema.welcome.v1'
import type { Guild, User } from '@type/index'
import formatterText, { formatterTextUser } from 'src/formatterText'
import { buildFilter } from './buildFilter'

interface PaintTextProps {
  ctx: CanvasRenderingContext2D
  layer: Text
  base: Omit<Canvas, 'layers'>
  filterText: User & Guild
}

export default function paintText(props: PaintTextProps) {
  const { ctx, layer, base, filterText } = props

  let text = formatterTextUser(layer.text, filterText)
  let widthText = ctx.measureText(text).width

  if (layer.maxWidth !== 0 && layer.maxWidth) {
    while (widthText > layer.maxWidth || widthText < 0) {
      text = text.slice(0, -1)
      widthText = ctx.measureText(text).width
    }
    text += '...'
  }

  ctx.save() // save the current state of the canvas
  // Global Settings
  ctx.globalAlpha = layer.globalAlpha ?? 1
  ctx.font = `${layer.family} ${layer.weight}px`
  ctx.textAlign = layer.align
  ctx.textBaseline = layer.baseline
  ctx.fillStyle = layer.color
  ctx.filter = buildFilter(layer.filter)

  ctx.fillText(text, layer.dx, layer.dy)
  ctx.restore() // restore the previous state of the canvas
}
