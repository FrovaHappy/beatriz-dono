'use client'

import { useState } from 'react'
import style from './switch.module.scss'
import { calculatePercents } from '@/utils/getPadding'
interface Props {
  state?: boolean
  height?: `${number}px` | `${number}rem`
}
export default function useSwitch({ state = false, height = '2rem' }: Props) {
  const [value, setValue] = useState(state)

  const Button = (
    <div
      className={style.container}
      style={{
        height,
        width: calculatePercents(height, 1.625),
        borderRadius: calculatePercents(height, 0.3),
      }}
    >
      <input
        type="checkbox"
        onClick={() => { setValue(!value) }}
        defaultChecked={state}
        className={style.checkbox}
        id="checkbox"
      />
      <label className={style.switch} htmlFor="checkbox">
        <span
          className={style.slider}
          style={{ borderRadius: calculatePercents(height, 0.2) }}
        ></span>
      </label>
    </div>
  )

  return [value, Button]
}
