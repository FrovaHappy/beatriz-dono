import type { GuildContract } from '@hooks/contractApi'
import css from './CardGuild.module.scss'

interface CardGuildProps {
  guild: GuildContract
}
export default function CardGuild(props: CardGuildProps) {
  const { guild } = props
  const imageUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=256`
  const onClickHandler = (e: any) => {
    e.preventDefault()
    if (guild.isAdmin) document.location.href = `/dashboard/guild?id=${guild.id}`
    else document.location.href = 'https://discord.gg/DSSfHnwMw9'
  }
  return (
    <div className={css.card + (guild.isAdmin ? ` ${css.isAdmin}` : '')} onMouseUp={onClickHandler}>
      <img src={imageUrl} alt={guild.name} className={css.image} />
      <h2 className={css.title}>{guild.name}</h2>
    </div>
  )
}
