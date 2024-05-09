import React from 'react'

interface Props extends React.SVGProps<SVGSVGElement> {}
export default function IconStack(props: Props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 6l-8 4l8 4l8 -4l-8 -4" />
      <path d="M4 14l8 4l8 -4" />
    </svg>
  )
}
