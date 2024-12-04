export interface JsonResponse {
  ok: boolean
  message: string
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: any
}

export interface DataUser {
  id: string
  username: string
  avatar: string | null
  guilds: {
    name: string
    owner: boolean
    icon: string | null
    isAdmin: boolean
    id: string
  }[]
}