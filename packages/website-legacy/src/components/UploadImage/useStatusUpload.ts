import type { State } from '@/types/types'
import { useEffect, useState } from 'react'
import { type UploadStatus, useUpload } from './useUpload'

export default function useStatus(setUrl: (k: string) => void, file: File | null) {
  const [status, setStatus] = useState<UploadStatus>('finished')
  useEffect(() => {
    if (file === null) return
    setStatus('uploading')
    const useLink = async () => {
      const link = await useUpload(file)
      if (!link) {
        setStatus('error')
        return
      }
      setStatus('finished')
      setUrl(link as string)
    }
    useLink().catch(() => {
      setStatus('error')
    })
  }, [file])
  return [status, setStatus] satisfies State<UploadStatus>
}
