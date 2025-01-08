import type { Canvas, Layer } from '@/types/Canvas.types'

function changedLayers(canvas: Canvas, s: Layer) {
  const c = JSON.stringify(canvas)
  const layers = canvas.layers.map(l => (l.id === s.id ? s : l))
  canvas.layers = layers
  const cCompare = JSON.stringify(canvas)
  return c !== cCompare ? canvas : undefined
}

export default changedLayers
