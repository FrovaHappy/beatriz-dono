import type React from 'react'

interface Props extends React.SVGProps<SVGSVGElement> {}
export default function IconTextResize(props: Props) {
  return (
    <svg
      {...props}
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='currentColor'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M5 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' />
      <path d='M19 5m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' />
      <path d='M5 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' />
      <path d='M19 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' />
      <path d='M5 7v10' />
      <path d='M7 5h10' />
      <path d='M7 19h10' />
      <path d='M19 7v10' />
      <path d='M10 10h4' />
      <path d='M12 14v-4' />
    </svg>
  )
}
