import { useEffect, useState } from 'react'
import { Switch } from '@components/General/Switch'
import type { SettingContract } from '@hooks/contractApi'
import postSetting from '@hooks/postSetting'
import { toastCustom } from '@layouts/LayoutReact'
import type { ComponentProps } from '@src/types'

interface Props extends ComponentProps {
  guildId: string
  checked: boolean
  css: CSSModuleClasses
}

export default function ColorsButton(props: Props) {
  const { guildId, css, apiUrl, checked } = props
  const [updateSetting, setUpdateSetting] = useState<Partial<SettingContract>>({})
  const [check, setCheck] = useState(checked)
  const { setting, status } = postSetting(apiUrl, guildId, updateSetting, [check])

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleChange = (e: any) => {
    setUpdateSetting({ colorActive: e.target.checked })
    setCheck(e.target.checked)
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
      <Switch name='colors' checked={check} onChange={handleChange} disabled={status === 'loading'} />
    </div>
  )
}
