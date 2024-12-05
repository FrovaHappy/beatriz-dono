import { useEffect, useState } from 'react'
import getSetting from '@hooks/getSetting'
import ColorsButton from './ColorsButton'
import WelcomeButton from './WelcomeButton'
import LayoutReact from '@layouts/LayoutReact'
import type { ComponentProps } from '@src/types'
import cssCardSetting from './CardSetting.module.scss'
interface Props extends ComponentProps {}
export default function Settings({ apiUrl }: Props) {
  const [guildId, setGuildId] = useState<any>()
  const { setting, status } = getSetting(apiUrl, guildId, [guildId])
  useEffect(() => {
    const id = new URLSearchParams(document.location.search).get('id')
    if (!id) document.location.href = '/dashboard'
    console.log(id)
    setGuildId(id)
  }, [])
  if (status === 'loading') return <div className='loader' />
  if (status === 'error') return <div>Error</div>

  return (
    <LayoutReact>
      <div>
        <ColorsButton guildId={guildId} css={cssCardSetting} apiUrl={apiUrl} checked={!!setting?.colorActive} />
        <WelcomeButton guildId={guildId} apiUrl={apiUrl} css={cssCardSetting} checked={!!setting?.welcomeActive} />
      </div>
    </LayoutReact>
  )
}
