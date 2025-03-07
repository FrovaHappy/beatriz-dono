import type React from 'react'

interface Props extends React.SVGProps<SVGSVGElement> {}
export default function IconUserSquare(props: Props) {
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
      <path d='M9 10a3 3 0 1 0 6 0a3 3 0 0 0 -6 0' />
      <path d='M6 21v-1a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v1' />
      <path d='M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z' />
    </svg>
  )
}
