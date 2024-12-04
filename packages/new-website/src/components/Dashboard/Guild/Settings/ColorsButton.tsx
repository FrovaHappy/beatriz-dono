import { useEffect, useId, useState } from 'react'
import { Switch } from '../../../General/Switch'
import type { SettingContract } from '../../../../hooks/contractApi'
import postSetting from '../../../../hooks/postSetting'
import css from '../CardSetting.module.scss'
import { toastCustom } from '../../../LayoutReact'

export default function ColorsButton({ guildId }: { guildId: string }) {
  const [updateSetting, setUpdateSetting] = useState<Partial<SettingContract>>({})
  const { setting, status } = postSetting('http://localhost:3001', guildId, updateSetting, [guildId, updateSetting])

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleChange = (e: any) => {
    setUpdateSetting({ colorActive: e.target.checked })
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
      <h2 className={css.title}>Colors</h2>
      <p className={css.subtitle}>Enable colors</p>
      <Switch name='colors' checked={setting?.colorActive || false} onChange={handleChange} />
    </div>
  )
}
