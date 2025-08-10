import Loader from '@components/General/Loader'
import getSetting from '@hooks/getSetting'
import type { Urls } from '@utils/urls'
import { useMemo } from 'react'
import cssButtonsEnabledInLine from '../ButtonsEnabledInLine.module.scss'
import ColorsButton from '../Settings/ColorsButton'

interface Props {
  urls: Urls
}

export default function ColorsSettings(props: Props) {
  const { urls } = props
  const guildId = useMemo(() => {
    const id = new URLSearchParams(document.location.search).get('id')
    if (!id) document.location.href = '/dashboard'
    return id as string
  }, [])
  const { setting, status } = getSetting(urls.api, guildId, [guildId])
  if (status === 'loading') return <Loader height='50vh' form='infinite' />
  if (status === 'error') return <div>Error</div>

  return (
    <div>
      <Loader height='50vh' form='infinite' />
      <h2>Colors</h2>
      <ColorsButton
        guildId={guildId}
        apiUrl={urls.api}
        checked={!!setting?.colorActive}
        css={cssButtonsEnabledInLine}
        oauthCallback={urls.oAuth}
      />
    </div>
  )
}
