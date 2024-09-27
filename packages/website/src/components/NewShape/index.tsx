import { useCanvasCtx, useShapeModifyCtx } from '@/app/context'
import type { Icon, Image, Text } from '@/types/Canvas.types'
import IconPhoto from '@icons/IconPhoto'
import IconPlaylistAdd from '@icons/IconPlaylistAdd'
import IconStack from '@icons/IconStack'
import IconTextResize from '@icons/IconTextResize'
import IconUserSquare from '@icons/IconUserSquare'
import { useState } from 'react'
import defaultValue from './defaultsValues'
import style from './index.module.scss'

export default function NewShape() {
  const [show, setShow] = useState(false)
  const [canvas, setCanvas] = useCanvasCtx()
  const [, setShapeModify] = useShapeModifyCtx()

  function onClick(defaultValue: Text | Image | Icon) {
    return () => {
      const layer = { ...defaultValue, id: Date.now() }
      canvas.layers.push(layer)
      setShapeModify(layer)
      setCanvas({ ...canvas })
      setShow(false)
    }
  }
  const showOptions = show ? style.options__show : style.options
  return (
    <div className={style.content}>
      <p>Canvas</p>
      <span className={style.countStack}>
        {canvas.layers.length} / 10 <IconStack />
      </span>

      <button
        type='button'
        className={style.newButton}
        onClick={() => {
          setShow(!show)
        }}
      >
        <IconPlaylistAdd />
        new Shape
      </button>
      <div className={showOptions}>
        <button type='button' onClick={onClick(defaultValue.TEXT)}>
          <IconTextResize />
          text
        </button>
        <button type='button' onClick={onClick(defaultValue.IMAGE)}>
          <IconPhoto /> image
        </button>
        <button type='button' onClick={onClick(defaultValue.ICON)}>
          <IconUserSquare />
          icon
        </button>
      </div>
    </div>
  )
}
