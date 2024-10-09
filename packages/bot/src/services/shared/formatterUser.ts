import formatterText from '@libs/formatterText'
import type { User } from 'discord.js'

/**
 * @deprecated
 */
export function formatterUser(s: string, m: User, count: number | undefined): string {
  let str = s
  str = formatterText(str, {
    userCount: (count ?? 0).toString(),
    userGlobal: m.globalName ?? m.username,
    userId: m.id,
    userName: m.username
  })
  return str
}
