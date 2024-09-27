import type { Color } from '@prisma/client'
import { Collection, type GuildMemberRoleManager, type Role } from 'discord.js'

export default async function removeRoles(roles: Collection<string, Role> | undefined, colors: Color[], i: any) {
  const colorsRemove = roles?.filter(role => colors.some(color => color.roleId === role.id)) ?? new Collection()
  const logDeleteRoles = {
    total: colorsRemove.size,
    fails: [] as Role[]
  }
  for (const [, role] of colorsRemove) {
    try {
      await (i.member?.roles as GuildMemberRoleManager).remove(role)
    } catch (error) {
      logDeleteRoles.fails.push(role)
    }
  }
  return logDeleteRoles
}
