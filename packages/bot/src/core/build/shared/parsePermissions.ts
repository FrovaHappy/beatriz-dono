import { type PermissionResolvable, PermissionsBitField, type PermissionsString } from 'discord.js'

export default function parsePermissions(
  permissionsBot: PermissionsString[],
  permissionsRequired: PermissionResolvable[]
) {
  const permissionsCurrent = new PermissionsBitField(permissionsRequired).toArray()
  const permissionsNeeded = permissionsBot.filter(p => !permissionsCurrent.some(pc => pc === p))
  return permissionsNeeded.map(p => `- \`${p}\``).join('\n')
}
