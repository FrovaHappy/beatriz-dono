'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import welcome from './welcome.json'
import { Canvas, Layer } from '@/types/Canvas.types'
import { State } from '@/types/types'
import { getFonts } from '@/utils/getFonts'

const HomeContext = createContext<State<Canvas> | null>(null)
const ShapeModifyContext = createContext<State<Layer | null> | null>(null)

export function useCanvasCtx() {
  const c = useContext(HomeContext)
  if (!c) throw new Error('this Canvas context is not available in this instance')
  return c
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
    const restoreCanvas = JSON.parse(window.localStorage.getItem('canvas') ?? 'null') ?? welcome
    setCanvasFake(restoreCanvas)

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
