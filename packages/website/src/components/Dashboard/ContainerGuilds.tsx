import type { Urls } from '@utils/urls'
import getUser, { Status } from '../../hooks/getUser'
import CardGuild from './CardGuild'
import css from './ContainerGuilds.module.scss'

interface ContainerGuildsProps {
  urls: Urls
}

export default function ContainerGuilds(props: ContainerGuildsProps) {
  const { urls } = props
  const { user, status } = getUser(urls.api, [])

  if (status === Status.LOADING) {
    return <div>Loading... {urls.api}</div>
  }
  if (status === Status.ERROR) {
    return <div>Error</div>
  }

  return (
    <div className={css.container}>
      {user?.guilds
        .sort(g => (g.isAdmin ? -1 : 1))
        .map(guild => {
          return <CardGuild key={guild.id} guild={guild} />
        })}
    </div>
  )
}
