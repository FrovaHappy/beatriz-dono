import formatterText from '@lib/formatterText'
import type { User } from 'discord.js'

export function formatterUser(str: string, m: User, count: number | undefined): string {
  str = formatterText(str, {
    userCount: (count ?? 0).toString(),
    userGlobal: m.globalName ?? m.username,
    userId: m.id,
    userName: m.username
  })
  return str
}
