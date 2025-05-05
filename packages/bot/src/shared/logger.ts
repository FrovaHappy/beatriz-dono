import p from 'picocolors'
import type { Formatter } from 'picocolors/types'

interface LogProps {
  type: 'info' | 'warn' | 'error' | 'success'
  head: string
  title?: string
  body?: string
}

export function info(str: string) {
  return p.italic(p.gray(str))
}
export function important(str: string) {
  return p.bold(str)
}
export const decoreLog = {
  info,
  important
}

export default function logger(props: LogProps) {
  const { type, head, body, title } = props

  const defineType: Record<LogProps['type'], Formatter> = {
    info: p.bgWhiteBright,
    error: p.bgRedBright,
    success: p.bgBlueBright,
    warn: p.bgYellowBright
  }

  console.log(`${defineType[type](head ? ` ${head?.trim()} ` : '')} ${p.bold(title?.trim() ?? '')}`)
  if (body)
    console.log(
      body
        .split('\n')
        .map(s => `${p.bold(p.gray('┃'))}  ${s.trim()}`)
        .join('\n')
    )
  console.log() // new line
}
