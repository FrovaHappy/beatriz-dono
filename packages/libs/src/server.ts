import { createCanvas, loadImage } from '@napi-rs/canvas'
import paintCanvas from '@libs/PaintCanvas'

export const getImageData = async (url: string | null) => {
  if (!url) return null
  const dataFetch = await fetch(url).then(async res => (await res.blob()).arrayBuffer())

  const data = await loadImage(dataFetch)
  const canvas = createCanvas(data.width, data.height)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(data, 0, 0, data.width, data.height)
  const imageData = ctx.getImageData(0, 0, data.width, data.height)
  return imageData
}

export async function generateImage() {
  paintCanvas
}
