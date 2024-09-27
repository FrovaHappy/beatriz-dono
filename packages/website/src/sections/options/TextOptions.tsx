import { useCanvasCtx, useShapeModifyCtx } from '@/app/context'
import type { Layer, Text } from '@/types/Canvas.types'
import useColorsInput from '@ui/useColorsInput'
import useInputNumber from '@ui/useInputNumber'
import useInputText from '@ui/useInputText'
import useSelections from '@ui/useSelections'
import { cloneElement, useEffect } from 'react'
import { HEIGHT, LIMIT_CANVAS, WIDTH_LARGE, WIDTH_SHORT } from '.'
import style from './index.module.scss'
export default function TextOptions({ shape }: { shape: Text }) {
  const [canvas, setCanvas] = useCanvasCtx()
  const [, setShapeModify] = useShapeModifyCtx()

  const options = {
    title_dimensions: [
      undefined,
      <h3 key={style.title} className={style.title}>
        {' '}
        Dimensiones{' '}
      </h3>
    ],
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
    title_text: [
      undefined,
      <h3 key={style.title} className={style.title}>
        {' '}
        Texto{' '}
      </h3>
    ],
    content: useInputText({
      defaultValue: shape.content,
      height: HEIGHT,
      title: 'Content',
      width: WIDTH_LARGE,
      placeholder: shape.content,
      regexArray: []
    }),
    family: useSelections({
      idSelect: shape.family ?? 'Roboto',
      height: HEIGHT,
      title: 'Family',
      width: WIDTH_LARGE,
      values: [
        { id: 'Roboto', title: 'Roboto', fontFamily: 'Roboto' },
        { id: 'DancingScript', title: 'DancingScript', fontFamily: 'DancingScript' },
        { id: 'Inter', title: 'Inter', fontFamily: 'Inter' },
        { id: 'Karla Italic', title: 'Karla Italic', fontFamily: 'Karla Italic' },
        { id: 'Karla', title: 'Karla', fontFamily: 'Karla' },
        { id: 'Lato', title: 'Lato', fontFamily: 'Lato' },
        { id: 'Nunito Italic', title: 'Nunito Italic', fontFamily: 'Nunito Italic' },
        { id: 'Nunito', title: 'Nunito', fontFamily: 'Nunito' }
      ]
    }),
    align: useSelections<CanvasTextAlign>({
      title: 'Align',
      idSelect: shape.align ?? 'start',
      height: HEIGHT,
      width: WIDTH_LARGE,
      values: [
        {
          id: 'start',
          title: 'Start'
        },
        {
          id: 'center',
          title: 'Center'
        },
        {
          id: 'end',
          title: 'End'
        }
      ]
    }),
    baseline: useSelections<CanvasTextBaseline>({
      idSelect: shape.baseline,
      height: HEIGHT,
      title: 'Baseline',
      width: WIDTH_LARGE,
      values: [
        { id: 'top', title: 'Top' },
        { id: 'hanging', title: 'Hanging' },
        { id: 'middle', title: 'Middle' },
        { id: 'alphabetic', title: 'Alphabetic' },
        { id: 'ideographic', title: 'Ideographic' },
        { id: 'bottom', title: 'Bottom' }
      ]
    }),
    color: useColorsInput({
      defaultValue: shape.color,
      height: HEIGHT,
      width: WIDTH_SHORT,
      title: 'Color'
    }),
    limitLetters: useInputNumber({
      max: 250,
      min: 1,
      step: 1,
      defaultValue: `${shape.limitLetters}`,
      height: HEIGHT,
      title: 'Limit',
      width: WIDTH_SHORT
    }),
    weight: useInputNumber({
      defaultValue: `${shape.weight}`,
      height: HEIGHT,
      title: 'Weight',
      placeholder: shape.weight.toString(),
      width: WIDTH_SHORT,
      step: 50,
      min: 0,
      max: 1000
    }),
    size: useInputNumber({
      defaultValue: `${shape.size}`,
      height: HEIGHT,
      title: 'Size',
      placeholder: shape.size.toString(),
      width: WIDTH_SHORT,
      step: 1,
      min: 0,
      max: LIMIT_CANVAS
    })
  }
  const values = Object.keys(options).map(key => options[key as keyof Omit<Text, 'type'>][0])
  const components = Object.keys(options).map(key => options[key as keyof Omit<Text, 'type'>][1])
  useEffect(() => {
    let s = shape as Layer<Text>
    s = {
      x: options.x[0],
      y: options.y[0],
      type: s.type,
      id: s.id,
      align: options.align[0]?.id ?? 'left',
      baseline: options.baseline[0]?.id ?? 'alphabetic',
      color: options.color[0],
      family: options.family[0]?.id ?? 'Roboto',
      limitLetters: options.limitLetters[0],
      content: options.content[0] ?? '',
      weight: options.weight[0],
      size: options.size[0]
    }

    setCanvas(canvas, s)
    setShapeModify(s)
  }, values)

  return <>{components.map((c, i) => cloneElement(c, { key: c.key }))}</>
}
