import { useEffect, useState } from 'react'
import type { SettingContract } from './contractApi'

enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function postSetting(apiUrl: string, guildId: string, body: Partial<SettingContract>, deps: any[]) {
  const [status, setStatus] = useState<Status>(Status.LOADING)
  const [setting, setSetting] = useState<SettingContract>()
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setStatus(Status.LOADING)

    if (Object.keys(body ?? {}).length === 0 || !guildId) {
      setStatus(Status.ERROR)
      return
    }

    const request = new Request(`${apiUrl}/guild/setting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ guildId, ...body })
    })
    fetch(request)
      .then(res => res.json())
      .then(d => {
        const { data, ok, message } = d
        console.log(data)
        if (!ok) {
          return setStatus(Status.ERROR)
        }
        setSetting({
          colorActive: data.colorActive,
          welcomeActive: data.welcomeActive
        })
        setStatus(Status.SUCCESS)
      })
  }, deps)
  return { setting, status }
}
