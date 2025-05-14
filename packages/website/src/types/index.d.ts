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
  icon?: keyof typeof icons
}
