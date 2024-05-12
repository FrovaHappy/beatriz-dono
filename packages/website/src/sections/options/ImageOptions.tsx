import { useCanvasCtx, useShapeModifyCtx } from '@/app/context'
import style from './index.module.scss'
import { type Image, type Layer } from '@/types/Canvas.types'
import { cloneElement, useEffect } from 'react'
import { HEIGHT, LIMIT_CANVAS, WIDTH_LARGE, WIDTH_SHORT } from '.'
import useInputNumber from '@ui/useInputNumber'
import UploadImage from '@/components/UploadImage'
import useColorsInput from '@ui/useColorsInput'

export default function ImageOptions({ shape }: { shape: Image }) {
  const [canvas, setCanvas] = useCanvasCtx()
  const [, setShapeModify] = useShapeModifyCtx()

  const options = {
    img: UploadImage({ defaultValue: shape.img, width: WIDTH_LARGE }),
    title_dimensions: [undefined, <h3 className={style.title}> Dimensiones </h3>],
    x: useInputNumber({
      defaultValue: `${shape.x}`,
      height: HEIGHT,
      title: 'X',
      placeholder: shape.x.toString(),
      width: WIDTH_SHORT,
      step: 1,
      min: 0,
      max: LIMIT_CANVAS
    }),
    y: useInputNumber({
      defaultValue: `${shape.y}`,
      height: HEIGHT,
      title: 'Y',
      placeholder: shape.y.toString(),
      width: WIDTH_SHORT,
      step: 1,
      min: 0,
      max: LIMIT_CANVAS
    }),
    width: useInputNumber({
      defaultValue: `${shape.width}`,
      height: HEIGHT,
      title: 'W',
      placeholder: shape.width.toString(),
      width: WIDTH_SHORT,
      step: 1,
      min: 0,
      max: LIMIT_CANVAS
    }),
    height: useInputNumber({
      defaultValue: `${shape.height}`,
      height: HEIGHT,
      title: 'H',
      placeholder: shape.height.toString(),
      width: WIDTH_SHORT,
      step: 1,
      min: 0,
      max: LIMIT_CANVAS
    }),
    color: useColorsInput({
      title: 'color',
      defaultValue: shape.color,
      width: WIDTH_SHORT,
      height: HEIGHT
    })
  }
  const values = Object.keys(options).map(key => options[key as keyof Omit<Image, 'type' | 'color'>][0])
  const components = Object.keys(options).map(key => options[key as keyof Omit<Image, 'type' | 'color'>][1])
  useEffect(() => {
    let s = shape as Layer<Image>
    s = {
      img: options.img[0],
      height: options.height[0],
      width: options.width[0],
      x: options.x[0],
      y: options.y[0],
      color: options.color[0] !== '#000000' ? options.color[0] : undefined,
      type: s.type,
      id: s.id
    }

    setCanvas(canvas, s)
    setShapeModify(s)
  }, values)

  return <>{components.map((c, i) => cloneElement(c, { key: i }))}</>
}
