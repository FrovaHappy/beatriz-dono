import type { DetailedHTMLProps, HTMLAttributes } from 'react'

import inputStyle from './Input.module.scss'
import { calculatePercents } from '@/utils/getPadding'
export interface OptionsMaskInput {
  title?: string
  height?: `${number}px` | `${number}rem`
  width?: `${number}px` | `${number}rem`
}
interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  options: OptionsMaskInput
}

export default function MaskInput({ options, children, className, style, ...props }: Props) {
  const { height = '2rem', width = 'fit-content', title } = options
  return (
    <div
      className={`${inputStyle.content} ${className}`}
      style={{
        height,
        width,
        padding: `${calculatePercents(height, 0.15)} ${calculatePercents(height, 0.25)}`,
        fontSize: calculatePercents(height, 0.45),
        ...style
      }}
      {...props}>
      {!title || (
        <>
          <span className={inputStyle.title}>{title}</span>
          <span className={inputStyle['title--line']} />
        </>
      )}
      {children}
    </div>
  )
}
