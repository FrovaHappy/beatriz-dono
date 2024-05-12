import { useCanvasCtx } from '@/app/context'
import IconCode from '@icons/IconCode'
import Buttons from '@ui/useButton'
import React from 'react'

function GenerateJson() {
  const [canvas] = useCanvasCtx()

  const callback = () => {
    const json = JSON.stringify(canvas, null, 2)
    navigator.clipboard.writeText(json)
  }
  const [, Button] = Buttons({
    text: 'Copiar código',
    callback,
    Icon: IconCode
  })

  return (
    <span
      style={{
        position: 'absolute',
        bottom: '25px',
        right: '25px'
      }}>
      {Button}
    </span>
  )
}

export default GenerateJson
