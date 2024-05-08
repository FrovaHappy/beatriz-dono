import { Base, Image, TextBase, User, Icon } from '@/types/Canvas.types'
import { userFormatting } from '../formattingText'
const iconsImgs = ['https://imgur.com/hqaBgS5.png', 'https://imgur.com/CXJuNlC.png', 'https://imgur.com/OD8Bngd.png']
const shapes = {
  circle: 'M 1000,500 A 500,500 0 0 1 500,1000 500,500 0 0 1 0,500 500,500 0 0 1 500,0 500,500 0 0 1 1000,500 Z',
  square: 'M 0,0 H 1000 V 1000 H 0 Z',
  square5:
    'M0 50C0 22.3858 22.3858 0 50 0H950C977.614 0 1000 22.3858 1000 50V950C1000 977.614 977.614 1000 950 1000H50C22.3858 1000 0 977.614 0 950V50Z',
  square10:
    'm 100,0 h 800 c 55.4,0 100,44.6 100,100 v 800 c 0,55.4 -44.6,100 -100,100 H 100 C 44.6,1000 0,955.4 0,900 V 100 C 0,44.6 44.6,0 100,0 Z',
  square15:
    'm 150,0 h 700 c 83.1,0 150,66.9 150,150 v 700 c 0,83.1 -66.9,150 -150,150 H 150 C 66.9,1000 0,933.1 0,850 V 150 C 0,66.9 66.9,0 150,0 Z',
  square20:
    'm 200,0 h 600 c 110.8,0 200,89.2 200,200 v 600 c 0,110.8 -89.2,200 -200,200 H 200 C 89.2,1000 0,910.8 0,800 V 200 C 0,89.2 89.2,0 200,0 Z'
}
export async function renderIcon(
  image: Icon,
  ctx: CanvasRenderingContext2D,
  base: Base & TextBase,
  Path2DInstance: typeof Path2D,
  loadImage: (k: string) => Promise<HTMLImageElement>
) {
  const index = Math.floor(Math.random() * iconsImgs.length)
  const { x, y, height, width, color, shape } = image
  const path = new Path2DInstance(shapes[shape])
  const scale = (v: number) => (v * 1) / 1000
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale(width), scale(height))
  ctx.clip(path)
  ctx.fillStyle = color ?? 'transparent'
  ctx.fillRect(0, 0, 1000, 1000)
  ctx.drawImage(await loadImage(iconsImgs[index]), 0, 0, 1000, 1000)

  ctx.restore()
}
