import { Switch } from '../../General/Switch'
import css from './CardSetting.module.scss'
interface CardSettingProps {
  switchHandler: (e: any) => void
  title: string
  subtitle: string
  status: boolean
}

export default function CardSetting(props: CardSettingProps) {
  const { switchHandler, title, subtitle, status } = props
  return (
    <div className={css.card}>
      <h2 className={css.title}> {title} </h2>
      <h3 className={css.subtitle}> {subtitle} </h3>
      <Switch onChange={switchHandler} name={title} checked={status} />
      <Switch name={title} checked={status} />
    </div>
  )
}
