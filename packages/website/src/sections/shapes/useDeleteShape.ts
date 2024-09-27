import { useCanvasCtx } from '@/app/context'

export default function useDeleteShape(id: number) {
  const [canvas, setCanvas] = useCanvasCtx()

  return () => {
    const layerIndex = canvas.layers.findIndex(l => l.id === id)
    if (layerIndex === -1) return
    canvas.layers.splice(layerIndex, 1)
    setCanvas({ ...canvas })
  }
}
