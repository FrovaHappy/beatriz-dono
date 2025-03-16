import type React from 'react'
import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

interface LayoutReactProps {
  children: React.JSX.Element
}
const id = 'iii'
const toasts = {
  init: () => toast.loading('Loading...', { toastId: id }),
  error: () => toast.update(id, { render: 'Error', type: 'error', isLoading: false, autoClose: 2000 }),
  success: () => toast.update(id, { render: 'Success', type: 'success', isLoading: false, autoClose: 2000 }),
  loading: () => toast.update(id, { render: 'Loading...', type: 'default', isLoading: true, autoClose: false })
}
export function toastCustom(type: keyof typeof toasts) {
  return toasts[type]()
}

export default function LayoutReact(props: LayoutReactProps) {
  const { children } = props
  return (
    <>
      {children}
      <ToastContainer />
    </>
  )
}
