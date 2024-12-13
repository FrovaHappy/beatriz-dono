import type { Canvas, Shape } from 'src/schemas/schema.welcome.v1'

interface PaintShapeProps {
  ctx: CanvasRenderingContext2D
  layer: Shape
  base: Omit<Canvas, 'layers'>
  Path2D: typeof Path2D
}

export default function paintShape(props: PaintShapeProps) {
  const { ctx, layer, base, Path2D } = props
}