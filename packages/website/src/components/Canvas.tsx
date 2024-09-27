import { useCanvasCtx } from '@/app/context'
import renderCanvas from '@lib/renderCanvas'
import type { Image, Layer } from '@type/Canvas'
import { type CSSProperties, useEffect, useMemo, useRef } from 'react'
const USER = {
  id: '2378364956435',
  username: 'pedro_224',
  globalName: 'Pedro Editor',
  count: '13',
  avatar: 'https://imgur.com/GCcsX8J.png'
}
async function loadImage(path: string) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.src = path
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      reject(img)
    }
  })
}
const BackgroundTransparent =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA9hAAAPYQGoP6dpAAAASklEQVRYR2NMZV8vyUABmP0z8DkF2hmYKNFMDb2jDhgNgdEQGA2B0RAYDYHREGCktEqltD0xGgWjITAaAqMhMBoCoyEwGgIDHgIANtEFcxA6Am0AAAAASUVORK5CYII='

const style: CSSProperties = {
  backgroundImage: `url(${BackgroundTransparent}`,
  backgroundRepeat: 'repeat',
  gridRow: '1/3'
}
export default function Canvas() {
  const [canvas] = useCanvasCtx()
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx) return
    const { layers, ...base } = canvas
    const wait = async () => {
      const images: Record<string, HTMLImageElement> = {}
      for (const l of layers) {
        if (l.type === 'image') {
          images[l.id] = await loadImage((l as Layer<Image>).img ?? '')
        }
        if (l.type === 'icon') {
          images[l.id] = await loadImage(USER.avatar)
        }
      }
      renderCanvas(layers, base, USER, ctx, Path2D, images)
    }
    wait()
  }, [canvas])

  return useMemo(() => <canvas ref={ref} height={canvas.height} style={style} width={canvas.width} />, [])
}
