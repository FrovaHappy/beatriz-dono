import type { InputExport } from '@/types/types'
import useSetterTimeOut from '@hooks/useSetterTimeOut'
import { useState } from 'react'
import MaskInput, { type OptionsMaskInput } from './MaskInput'
type Value = string | undefined
interface Props extends OptionsMaskInput {
  defaultValue?: string
}
export default function useColorsInput({ defaultValue = '#000000', height, title, width }: Props): InputExport<Value> {
  const [value, setValue] = useState<Value>(defaultValue)
  const [valueTimeout, setValueTimeout] = useSetterTimeOut<Value>({ setValue, value, defaultValue })
  const handlerOnBlur: React.FocusEventHandler<HTMLInputElement> = e => {
    e.preventDefault()
    const value = e.target.value
    setValueTimeout(value)
  }
  const Component = (
    <MaskInput options={{ title, height, width }}>
      <input
        type='color'
        value={valueTimeout}
        onChange={handlerOnBlur}
        placeholder={defaultValue ?? undefined}
        style={{ width: '100%', height: '100%', minWidth: '2rem' }}
      />
    </MaskInput>
  )

  return [value, Component]
}
