import { useState } from 'react'
import inputStyle from './Input.module.scss'
import MaskInput, { type OptionsMaskInput } from './MaskInput'
import useSetterTimeOut from './useSetterTimeOut'
type Value = string | undefined
interface Reg {
  regex: RegExp
  msg: string
}
export interface TextInputProps extends OptionsMaskInput {
  placeholder?: string
  defaultValue?: string
  regexArray: Reg[]
}
export default function useInputText(props: TextInputProps) {
  const { title, regexArray, defaultValue, placeholder, height, width } = props

  const [value, setValue] = useState<Value>(defaultValue)
  const [valueError, setValueError] = useState<Value>(undefined)
  const [valueTimeout, setValueTimeout] = useSetterTimeOut<Value>({
    value,
    setValue,
    defaultValue
  })
  const [msgError, setMsgError] = useState<Value>(undefined)

  const onChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    e.preventDefault()
    const m = e.target.value || ''
    setValueError(m)
    for (const r of regexArray) {
      const test = r.regex.test(m)
      if (test) continue
      setMsgError(r.msg)
      return
    }
    setValueError(undefined)
    setMsgError(undefined)
    setValueTimeout(m)
  }
  const onBlur: React.FocusEventHandler<HTMLInputElement> = e => {
    e.preventDefault()
    if (e.target.value === '') e.target.value = defaultValue ?? ''
  }

  const Component = (
    <MaskInput options={{ height, title, width }} className={msgError ? inputStyle.error : ''}>
      <input
        className={inputStyle.props}
        type='text'
        value={valueError ?? valueTimeout ?? ''}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
      />

      {msgError ? <span className={inputStyle.error}>{msgError}</span> : undefined}
    </MaskInput>
  )
  return [value, Component] as [value: Value, select: JSX.Element]
}
