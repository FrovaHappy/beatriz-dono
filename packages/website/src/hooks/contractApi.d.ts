export interface SettingContract {
  colorActive: boolean
  welcomeActive: boolean
}

export interface UserContract {
  id: string
  username: string
  avatar: string
  guilds: GuildContract[]
}

export interface GuildContract {
  id: string
  name: string
  icon: string
  owner: boolean
  isAdmin: boolean
}
