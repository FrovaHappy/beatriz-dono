import Loader from '@components/General/Loader'
import getUser from '@hooks/getUser'
import type { ComponentProps } from '@src/types'
import css from './LoginButton.module.scss'
interface Props extends ComponentProps {}

const Login = ({ apiUrl, oauthCallback }: ComponentProps) => {
  return (
    <a href={oauthCallback} className='button button--secondary'>
      Iniciar sesión
    </a>
  )
}

export default function LoginButton({ apiUrl, oauthCallback }: Props) {
  const { status, user } = getUser(apiUrl, [])
  const activeOptions = (e: any) => {
    const active = e.target.getAttribute('active')
    e.target.setAttribute('active', active === 'true' ? 'false' : 'true')
  }

  if (status === 'loading') return <Loader form='infinite' height='2.4rem' aspectRatio='1/1' />
  if (status === 'error') return <Login apiUrl={apiUrl} oauthCallback={oauthCallback} />
  if (!user) return <Login apiUrl={apiUrl} oauthCallback={oauthCallback} />
  return (
    <div className={css.avatar}>
      <img
        src={`https://cdn.discordapp.com/avatars/${user.id}/a_${user.avatar}.png?size=48`}
        alt={user.username}
        onMouseUp={activeOptions}
      />
      <ul className={css.options}>
        <li>
          <a href='/dashboard'>
            <i className='ti ti-tool button--icon' />
            <span className='button--text'>Dashboard</span>
          </a>
        </li>
        <li>
          <a href={`${apiUrl}/logout`}>
            <i className='ti ti-power button--icon' />
            <span className='button--text'>Cerrar sesión</span>
          </a>
        </li>
      </ul>
    </div>
  )
}
