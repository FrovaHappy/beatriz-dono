/* eslint-disable react-hooks/exhaustive-deps */
import { type State } from '@/types/types'
import { useEffect, useState } from 'react'

interface Props<T> {
  time?: number
  value: T
  defaultValue: T
  setValue: (value: T) => void
  deps?: any[]
}
export default function useSetterTimeOut<T = any>({ value, setValue, time = 100, deps = [], defaultValue }: Props<T>) {
  const [controller, setController] = useState<T>(value)
  useEffect(() => {
    const resolve = setTimeout(() => {
      setValue(controller)
    }, time)
    return () => {
      clearTimeout(resolve)
    }
  }, [controller, ...deps])
  useEffect(() => {
    setValue(defaultValue)
    setController(defaultValue)
  }, [defaultValue])
  return [controller, setController] as State<T>
}
