import { useEffect, useState } from 'react'
import { toastCustom } from '../../../LayoutReact'
import css from '../CardSetting.module.scss'
import type { SettingContract } from '../../../../hooks/contractApi'
import postSetting from '../../../../hooks/postSetting'
import type { ComponentProps } from '../../../../types'
import { Switch } from '../../../General/Switch'

interface Props extends ComponentProps {
  guildId: string
  checked: boolean
}

export default function welcomeButton(props: Props) {
  const { guildId, apiUrl, checked } = props
  const [updateSetting, setUpdateSetting] = useState<Partial<SettingContract>>({})
  const { setting, status } = postSetting(apiUrl, guildId, updateSetting, [guildId, updateSetting])

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleChange = (e: any) => {
    setUpdateSetting({ welcomeActive: e.target.checked })
  }
  useEffect(() => {
    if (!setting) return
    toastCustom('init')
    if (status === 'loading') toastCustom('loading')
    if (status === 'error') toastCustom('error')
    if (status === 'success') toastCustom('success')
  }, [status, setting])
  return (
    <div className={css.card}>
      <h2 className={css.title}>Welcome</h2>
      <p className={css.subtitle}>Administra tus mensajes de bienvenida</p>
      <Switch name='colors' checked={setting?.welcomeActive || false} onChange={handleChange} />
    </div>
  )
}