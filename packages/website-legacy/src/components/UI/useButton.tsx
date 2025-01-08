'use client'
import { useState } from 'react'
import style from './useButton.module.scss'
interface Props {
  value?: boolean
  text: string
  callback: () => void
  Icon?: (p: React.AllHTMLAttributes<any>) => React.ReactNode
}
export default function Buttons(props: Props) {
  const { value = false, text, callback, Icon } = props
  const [v, setValue] = useState(value)
  const onClick = () => {
    setValue(!v)
    callback()
  }
  const Button = (
    <button type='button' onClick={onClick} className={style.main}>
      {!Icon || <Icon />}
      {text}
    </button>
  )

  return [v, Button]
}
