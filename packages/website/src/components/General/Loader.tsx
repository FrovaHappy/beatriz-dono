import css from './Loader.module.scss'

interface Props {
  form?: 'infinite' | 'pulse'
  width?: string
  height?: string
  aspectRatio?: `${number}/${number}`
}

export default function Loader(props: Props) {
  const { width, height, form = 'pulse', aspectRatio } = props
  const classLoader = {
    infinite: css.loaderInfinite,
    pulse: css.loader
  }
  return (
    <div className={css.container} style={{ width, height, aspectRatio }}>
      <div className={classLoader[form]} />
    </div>
  )
}