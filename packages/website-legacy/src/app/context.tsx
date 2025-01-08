'use client'
import type { Canvas, Layer } from '@/types/Canvas.types'
import type { State } from '@/types/types'
import { getFonts } from '@/utils/getFonts'
import { jsonParse } from '@/utils/utils'
import { createContext, useContext, useEffect, useState } from 'react'

const HomeContext = createContext<State<Canvas> | null>(null)
const ShapeModifyContext = createContext<State<Layer | null> | null>(null)

function prevSetterCanvas(setCanvas: (k: any) => void) {
  return (canvas: Canvas, layer: Layer | null = null) => {
    const layers = layer ? canvas.layers.map(l => (l.id === layer?.id ? layer : l)) : canvas.layers
    setCanvas(() => ({ ...canvas, layers }))
  }
}
export function useCanvasCtx() {
  const c = useContext(HomeContext)
  if (!c) throw new Error('this Canvas context is not available in this instance')
  return [c[0], prevSetterCanvas(c[1])] as [Canvas, (canvas: Canvas, layer?: Layer | null) => void]
}
export function useShapeModifyCtx() {
  const c = useContext(ShapeModifyContext)
  if (!c) throw new Error('this Canvas context is not available in this instance')
  return c
}

export default function Context({ children }: React.PropsWithChildren) {
  const [canvas, setCanvas] = useState(null as unknown as Canvas)
  const [canvasFake, setCanvasFake] = useState(null as unknown as Canvas)
  const [shapeModify, setShapeModify] = useState<Layer | null>(null)
  useEffect(() => {
    const restoreCanvas = jsonParse<Canvas>(window.localStorage.getItem('canvas'))
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setCanvasFake(restoreCanvas!)

    const load = async () => {
      getFonts()
    }
    load()
  }, [])
  useEffect(() => {
    if (!canvasFake) return
    const timeout = setTimeout(() => {
      setCanvas(canvasFake)
      window.localStorage.setItem('canvas', JSON.stringify(canvasFake))
    }, 1)
    return () => clearTimeout(timeout)
  }, [canvasFake])
  if (!canvas) return <>building component</>
  return (
    <HomeContext.Provider value={[canvas, setCanvasFake]}>
      <ShapeModifyContext.Provider value={[shapeModify, setShapeModify]}>{children}</ShapeModifyContext.Provider>
    </HomeContext.Provider>
  )
}
