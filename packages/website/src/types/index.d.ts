import type { Icon } from '@utils/icons'
export interface ComponentProps {
  apiUrl: string
  oauthCallback: string
}

export interface ButtonProps {
  text?: string
  id?: string
  action: {
    type: 'anchor' | 'button'
    text: string
  }
  small?: boolean
  left?: boolean
  icon?: Icon
}
