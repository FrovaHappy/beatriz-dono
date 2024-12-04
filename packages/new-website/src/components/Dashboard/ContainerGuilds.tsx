import getUser, { Status } from '../../hooks/getUser'
import css from './ContainerGuilds.module.scss'
import CardGuild from './CardGuild'

interface ContainerGuildsProps {
  apiUrl: string
}

export default function ContainerGuilds(props: ContainerGuildsProps) {
  const { apiUrl } = props
  const { user, status } = getUser(apiUrl, [])

  if (status === Status.LOADING) {
    return <div>Loading... {apiUrl}</div>
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