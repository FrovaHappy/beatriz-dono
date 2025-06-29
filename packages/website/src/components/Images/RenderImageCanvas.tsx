import { generateImage } from '@libs/browser'
import { use, useEffect, useState } from 'react'
import { template, filterTextExample, getCssFonts } from '@libs/browser'
import { validateCanvas } from '@libs/PaintCanvas/schema.welcome.v1'

export default function RenderImageCanvas() {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loadCssFonts, setLoadCssFonts] = useState(false)
  useEffect(() => {
    const generateCanvasImage = async () => {
      try {
        const cssText = getCssFonts()
        const canvas = validateCanvas(template)
        if (!canvas.data) throw new Error('Invalid canvas')
        document.head.insertAdjacentHTML('beforeend', cssText)
        const image = await generateImage({
          template: canvas.data,
          filterText: filterTextExample
        })
        setImageUrl(image.toDataURL('image/png'))
      } catch (error) {
        console.error('Error generating image:', error)
      }
    }
    generateCanvasImage()
  }, [loadCssFonts])
  // useEffect(() => {
  //   setTimeout(() => setLoadCssFonts(true), 500)
  // }, [])

  if (!imageUrl) {
    return <div>Loading...</div>
  }

  return <img src={imageUrl} alt='example' onLoad={() => setLoadCssFonts(true)} />
}
