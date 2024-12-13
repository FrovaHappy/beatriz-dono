export interface User {
  userId: string
  userName: string
  displayName: string
  discriminator: string
  avatar: string
  banner?: string
}
export interface Guild {
  guildId: string
  guildName: string
  avatar: string
  banner?: string
  memberCount: number
}