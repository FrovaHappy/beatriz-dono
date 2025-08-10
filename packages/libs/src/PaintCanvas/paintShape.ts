import { buildFilter } from './buildFilter'
import type { Shape } from '@libs/schemas/welcome.v1'

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
  const filter = buildFilter(layer.filter)
  ctx.save()

  // obtain dimensions and scale of the image
  const dimension = {
    h: layer.dh ?? image?.height ?? 100,
    w: layer.dw ?? image?.width ?? 100
  }

  if (filter) ctx.filter = filter
  ctx.translate(layer.dx, layer.dy)

  if (patch) {
    ctx.save()
    // Scale the clip path according to the shape dimensions
    const scaleX = dimension.w / patch.w
    const scaleY = dimension.h / patch.h
    ctx.scale(scaleX, scaleY)
    ctx.clip(new Path2D(patch.d))
    ctx.fillStyle = color ?? 'transparent'
    ctx.fillRect(0, 0, patch.w, patch.h)

    if (image) {
      // Calculate image scaling to fit within the clip path dimensions
      const scaleImage = {
        w: (image.width * patch.w) / Math.min(image.width, image.height),
        h: (image.height * patch.h) / Math.min(image.width, image.height)
      }
      const middle = {
        w: Math.round((patch.w - scaleImage.w) / 2),
        h: Math.round((patch.h - scaleImage.h) / 2)
      }
      const aligns = {
        top: [middle.w, 0],
        button: [middle.w, patch.h - scaleImage.h],
        left: [0, middle.h],
        right: [0, 0],
        center: [middle.w, middle.h],
        'top-left': [0, 0],
        'top-right': [patch.w - scaleImage.w, 0],
        'bottom-left': [0, patch.h - scaleImage.h],
        'bottom-right': [patch.w - scaleImage.w, patch.h - scaleImage.h]
      }

      ctx.drawImage(
        image,
        aligns[patch.align ?? 'center'][0],
        aligns[patch.align ?? 'center'][1],
        scaleImage.w,
        scaleImage.h
      )
    }
    ctx.restore()
  } else {
    ctx.fillStyle = color ?? 'transparent'
    ctx.fillRect(0, 0, dimension.w, dimension.h)
    if (image) ctx.drawImage(image, 0, 0, dimension.w, dimension.h)
  }

  ctx.restore()
}
