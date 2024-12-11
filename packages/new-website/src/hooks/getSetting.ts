import { useEffect, useState } from 'react'
import type { SettingContract } from './contractApi'
enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function usSetting(apiUrl: string, id: string, deps: any[]) {
  const [status, setStatus] = useState<Status>(Status.LOADING)
  const [setting, setSetting] = useState<SettingContract>()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setStatus(Status.LOADING)
    if (!id) {
      setStatus(Status.ERROR)
      return
    }
    const request = new Request(`${apiUrl}/guild/setting/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    fetch(request)
      .then(res => res.json())
      .then(d => {
        const { data, ok, message } = d
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
