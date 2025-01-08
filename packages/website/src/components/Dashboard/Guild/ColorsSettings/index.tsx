import Loader from '@components/General/Loader'
import getSetting from '@hooks/getSetting'
import type { ComponentProps } from '@src/types'
import { useMemo } from 'react'
import ColorsButton from '../Settings/ColorsButton'

import css from './index.module.scss'
import cssButtonsEnabledInLine from '../ButtonsEnabledInLine.module.scss'

interface Props extends ComponentProps {}

export default function ColorsSettings(props: Props) {
  const { apiUrl } = props
  const guildId = useMemo(() => {
    const id = new URLSearchParams(document.location.search).get('id')
    if (!id) document.location.href = '/dashboard'
    return id as string
  }, [])
  const { setting, status } = getSetting(apiUrl, guildId, [guildId])
  if (status === 'loading') return <Loader height='50vh' form='infinite' />
  if (status === 'error') return <div>Error</div>

  return (
    <div>
      <Loader height='50vh' form='infinite' />
      <h2>Colors</h2>
      <ColorsButton guildId={guildId} apiUrl={apiUrl} checked={!!setting?.colorActive} css={cssButtonsEnabledInLine} />
    </div>
  )
}