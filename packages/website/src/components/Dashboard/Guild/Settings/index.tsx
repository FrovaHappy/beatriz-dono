import getSetting from '@hooks/getSetting'
import LayoutReact from '@layouts/LayoutReact'
import { useEffect, useMemo, useState } from 'react'
import cssCardSetting from './CardSetting.module.scss'
import ColorsButton from './ColorsButton'
import WelcomeButton from './WelcomeButton'
interface Props {
  apiUrl: string
  oauthCallback: string
}
export default function Settings({ apiUrl, oauthCallback }: Props) {
  const guildId = useMemo(() => {
    const id = new URLSearchParams(document.location.search).get('id')
    if (!id) document.location.href = '/dashboard'
    return id as string
  }, [])
  const goToLinks = {
    colors: () => {
      window.location.href = `/dashboard/guild/colors?id=${guildId}`
    },
    welcome: () => {
      window.location.href = `/dashboard/guild/welcome?id=${guildId}`
    }
  }
  const { setting, status } = getSetting(apiUrl, guildId, [guildId])
  if (status === 'loading') return <div className='loader' />
  if (status === 'error') return <div>Error</div>
  return (
    <LayoutReact>
      <div>
        <ColorsButton
          guildId={guildId}
          css={cssCardSetting}
          apiUrl={apiUrl}
          checked={!!setting?.colorActive}
          actionCard={goToLinks.colors}
          oauthCallback={oauthCallback}
        />
        <WelcomeButton
          guildId={guildId}
          apiUrl={apiUrl}
          css={cssCardSetting}
          checked={!!setting?.welcomeActive}
          oauthCallback={oauthCallback}
        />
      </div>
    </LayoutReact>
  )
}
