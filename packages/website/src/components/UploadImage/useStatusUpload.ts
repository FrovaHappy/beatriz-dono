import { useEffect, useState } from 'react'
import { type UploadStatus, useUpload } from './useUpload'
import { type State } from '@/types/types'

export default function useStatus(
  setUrl: (k: string) => void,
  file: File | null
) {
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
      setUrl(link)
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLink().catch(() => {
      setStatus('error')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])
  return [status, setStatus] satisfies State<UploadStatus>
}
