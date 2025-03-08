import { useEffect, useState } from 'react'
import type { GuildContract, UserContract } from './contractApi'

export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export default function getUser(apiUrl: string, deps: any[]) {
  const [user, setUser] = useState<UserContract>()
  const [status, setStatus] = useState<Status>(Status.LOADING)

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setStatus(Status.LOADING)
    const request = new Request(`${apiUrl}/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    fetch(request)
      .then(res => res.json())
      .then(d => {
        const { data, ok } = d
        if (!ok) {
          setStatus(Status.ERROR)
          return
        }
        setStatus(Status.SUCCESS)
        setUser({
          id: data.id,
          username: data.username,
          avatar: data.avatar,
          guilds: data.guilds.map((guild: any) => {
            return {
              id: guild.id,
              name: guild.name,
              icon: guild.icon,
              owner: guild.owner,
              isAdmin: guild.isAdmin
            } as GuildContract
          })
        })
      })
  }, deps)

  return { user, status }
}
