import { useEffect, useState } from 'react'
import getSetting from '@hooks/getSetting'
import ColorsButton from './ColorsButton'
import WelcomeButton from './WelcomeButton'
import LayoutReact from '@layouts/LayoutReact'
import type { ComponentProps } from '@src/types'
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
        <ColorsButton guildId={guildId} />
        <WelcomeButton guildId={guildId} checked={!!setting?.welcomeActive} apiUrl={apiUrl} />
      </div>
    </LayoutReact>
  )
}
