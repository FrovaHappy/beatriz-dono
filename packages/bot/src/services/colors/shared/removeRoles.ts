import type { Color } from '@/core/database/queries/colors'
import { Collection, type GuildMemberRoleManager, type Role } from 'discord.js'

/**
 * @param roles collection of roles in the guild server
 * @param colors array of colors to remove
 * @param i Any interaction
 * @returns an object with the total of roles removed and the roles that failed to remove
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function removeRolesOfUser(roles: Collection<string, Role> | undefined, colors: Color[], i: any) {
  const colorsRemove = roles?.filter(role => colors.some(color => color.role_id === role.id)) ?? new Collection()
  const logDeleteRoles = {
    total: colorsRemove.size,
    fails: [] as Role[]
  }
  for (const role of colorsRemove.values()) {
    try {
      await (i.member?.roles as GuildMemberRoleManager).remove(role)
    } catch (error) {
      logDeleteRoles.fails.push(role)
    }
  }
  return logDeleteRoles
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function removeRolesOfServer(roles: Collection<string, Role> | undefined, colors: Color[], i: any) {
  const colorsRemove = roles?.filter(role => colors.some(color => color.role_id === role.id)) ?? new Collection()
  const logDeleteRoles = {
    total: colorsRemove.size,
    fails: [] as Role[]
  }
  for (const role of colorsRemove.values()) {
    try {
      await i.guild?.roles.delete(role)
    } catch (error) {
      logDeleteRoles.fails.push(role)
    }
  }
  return logDeleteRoles
}
