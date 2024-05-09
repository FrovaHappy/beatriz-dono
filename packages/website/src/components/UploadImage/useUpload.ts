'use client'
import getBase64 from '@/utils/getBase64'
export type UploadStatus = 'uploading' | 'finished' | 'error'

export async function useUpload(file: File | null) {
  if (!file) return
  let base64Img = await getBase64(file)
  if (typeof base64Img === 'string') {
    base64Img = base64Img.replace(/^data:.+base64,/, '')
  }
  const result = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: base64Img })
  })
  const response = await result.json() // response.data is an object containing the image URL
  return response?.data?.link
}
