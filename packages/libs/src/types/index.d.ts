export type { Canvas, Shape, Text, Filter } from '../PaintCanvas/schema.welcome.v1'

export interface User {
  userId: string
  userName: string
  userDisplayName: string
  userDiscriminator: string
  userAvatar: string
  userBanner?: string
}
export interface Guild {
  guildId: string
  guildName: string
  guildAvatar: string
  guildBanner?: string
  membersCount: string
}
