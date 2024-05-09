/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState } from 'react'
import style from './Selections.module.scss'
import inputStyle from './Input.module.scss'
import IconChevronDown from '@/app/icons/IconChevronDown'
import { calculatePercents } from '@/utils/getPadding'
import MaskInput, { type OptionsMaskInput } from './MaskInput'
import { type InputExport } from '@/types/types'

interface Options<T> {
  id: T
  icon?: (p: React.AllHTMLAttributes<any>) => React.ReactNode
  fontFamily?: string
  title: string
}
interface Props<T> extends OptionsMaskInput {
  idSelect: T
  values: Array<Options<T>>
}

export default function useSelections<T = string>(props: Props<T>): InputExport<Options<T> | undefined> {
  const { title, width, idSelect, values, height = '2rem' } = props
  const [value, setValue] = useState(values.find(v => v.id === idSelect))
  const [show, setShow] = useState(false)
  const Icon = value?.icon
  useEffect(() => {
    setValue(values.find(v => v.id === idSelect))
  }, [idSelect])
  const ICONS_STYLE: React.CSSProperties = {
    height: calculatePercents(height, 0.7),
    aspectRatio: '1/1',
    flexShrink: '0'
  }
  const Select = (
    <MaskInput options={{ height, width, title }} onClick={() => { setShow(!show) }}>
      {Icon ? <Icon style={ICONS_STYLE} /> : undefined}
      <span className={inputStyle.props}>{value?.title ?? 'selecciona...'}</span>
      <IconChevronDown style={ICONS_STYLE} />

      <div className={`${style.values} + ${show ? style.show : ''}`}>
        {values.map(v => {
          const IconItem = v.icon
          return (
            <div
              key={v.id as string}
              onClick={() => { setValue(v) }}
              className={`${inputStyle.props} ${style.value} ${value?.id === v.id ? style['value--active'] : ''}`}
              style={{ height, fontFamily: v.fontFamily }}>
              {IconItem ? <IconItem style={ICONS_STYLE} /> : undefined}
              {v.title}
            </div>
          )
        })}
      </div>
    </MaskInput>
  )

  return [value, Select]
}
