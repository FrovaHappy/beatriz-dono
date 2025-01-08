import { useCanvasCtx } from '@/app/context'
import useColorsInput from '@ui/useColorsInput'
import useInputNumber from '@ui/useInputNumber'
import { useEffect } from 'react'
import { HEIGHT, LIMIT_CANVAS, WIDTH_SHORT } from '.'
import style from './index.module.scss'

export default function GeneralOptions() {
  const [canvas, setCanvas] = useCanvasCtx()

  const [height, heightInput] = useInputNumber({
    title: 'h',
    defaultValue: `${canvas.height}`,
    step: 1,
    min: 0,
    max: LIMIT_CANVAS,
    height: HEIGHT,
    width: WIDTH_SHORT
  })
  const [width, widthInput] = useInputNumber({
    title: 'w',
    defaultValue: `${canvas.width}`,
    step: 1,
    min: 0,
    max: LIMIT_CANVAS,
    height: HEIGHT,
    width: WIDTH_SHORT
  })
  const [background, backgroundInput] = useColorsInput({
    title: 'background',
    defaultValue: canvas.color,
    height: HEIGHT,
    width: WIDTH_SHORT
  })

  useEffect(() => {
    canvas.height = height
    canvas.width = width
    canvas.color = background !== '#000000' ? background : undefined
    setCanvas({ ...canvas })
  }, [background, height, width])

  return (
    <>
      <h3 className={style.title}>General</h3>
      {heightInput}
      {widthInput}
      {backgroundInput}
    </>
  )
}
