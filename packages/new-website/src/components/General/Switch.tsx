import { useId } from 'preact/hooks'
import css from './Switch.module.scss'
import type { JSX } from 'preact'

interface Props extends JSX.HTMLAttributes<HTMLInputElement> {
  name: string
  checked: boolean
}

export function Switch(props: Props) {
  const { name, checked, ...rest } = props
  const id = useId()
  return (
    <div className={css.content}>
      <input {...rest} type='checkbox' className={css.checkbox} name={name} id={id} checked={checked} />
      <label className={css.label} htmlFor={id}>
        <span className={css.switch} />
      </label>
    </div>
  )
}
