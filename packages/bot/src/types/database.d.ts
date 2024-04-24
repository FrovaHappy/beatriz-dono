import type { $Enums } from '@prisma/client'
export interface Color {
  id: string
  serverId: string
  colorId: string
  hexColor: string
}
export interface User {
  id: string
  userId: string
  serverId: string
}

export interface Server {
  id: string
  serverId: string
  accessCommand: $Enums.Access
  colorRoleId?: string | null
  roleColorPermission: string
}

export interface ServerWithColors extends Server {
  colors: Color[]
}

export interface ServerWithUsers extends Server {
  users: User[]
}
