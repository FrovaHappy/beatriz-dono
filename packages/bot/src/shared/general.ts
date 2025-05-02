import chalk, { type ChalkInstance } from 'chalk'
import fs from 'node:fs'

export async function readAllFiles(path: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(path)
  for (const file of files) {
    const stat = fs.statSync(`${path}/${file}`)
    if (stat.isDirectory()) {
      readAllFiles(`${path}/${file}`, arrayOfFiles)
    } else {
      arrayOfFiles.push(`${path}/${file}`)
    }
  }
  return arrayOfFiles
}

export function toJson<T = any>(str: any, limitOfRecursion = 1000): T | null {
  if (!str) return null
  let limit = limitOfRecursion
  return JSON.parse(str, (k, v) => {
    try {
      if (limit === 0) return v
      limit--
      return JSON.parse(v)
    } catch (error) {
      return v
    }
  })
}

/**
 * class to get the time in m:ss.ms
 * @example
 * ```
 * const timer = new Timer()
 * console.log(timer.final())
 * // output: 0:00.000 (m:ss.ms)
 * ```
 */
export class Timer {
  start: number
  end: number
  duration: number
  constructor() {
    this.start = performance.now()
    this.end = 0
    this.duration = 0
  }
  final() {
    this.end = performance.now()
    this.duration = this.end - this.start
    const timer = Math.round(this.duration)
    /// format time in m:ss:ms
    const time = {
      minutes: Math.floor(timer / 60000),
      seconds: Math.floor((timer % 60000) / 1000),
      milliseconds: timer % 1000
    }
    if (time.minutes > 0) return `${time.minutes}:${time.seconds}.${time.milliseconds} (m:ss.ms)`
    if (time.seconds > 0) return `${time.seconds}.${time.milliseconds} (s.ms)`
    return `${time.milliseconds}ms`
  }
}

interface LogProps {
  type: 'info' | 'warn' | 'error' | 'success'
  head: string
  run?: string
  body?: string
}
export function log(props: LogProps) {
  const { type, head, body, run } = props

  const defineType: Record<LogProps['type'], ChalkInstance> = {
    info: chalk.bgGreenBright,
    error: chalk.bgRedBright,
    success: chalk.bgBlueBright,
    warn: chalk.bgYellowBright
  }

  console.log(`${defineType[type](run ?? '')} ${head}`)
  if (body)
    console.log(
      body
        .split('\n')
        .map(s => `    ${s}`)
        .join('\n')
    )
}
