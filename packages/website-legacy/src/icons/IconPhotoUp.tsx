import type React from 'react'

interface Props extends React.SVGProps<SVGSVGElement> {}
export default function IconPhotoUp(props: Props) {
  return (
    <svg
      {...props}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M15 8h.01' />
      <path d='M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5' />
      <path d='M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3.5 3.5' />
      <path d='M14 14l1 -1c.679 -.653 1.473 -.829 2.214 -.526' />
      <path d='M19 22v-6' />
      <path d='M22 19l-3 -3l-3 3' />
    </svg>
  )
}
