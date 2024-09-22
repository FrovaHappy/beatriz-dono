import { type GuildMember, type PermissionResolvable, PermissionsBitField } from 'discord.js'

interface Props {
  permissions: PermissionResolvable[]
  bot: GuildMember | null | undefined
  nameInteraction: string
  type: string
}
export default function requiresBotPermissions(props: Props) {
  const { permissions, bot, nameInteraction, type } = props
  if (!bot) return { content: 'No se encontró el bot' }

  const permissionsCurrent = new PermissionsBitField(bot.permissions).toArray()

  if (!bot.permissions.has(permissions)) {
    const permissionsRequired = new PermissionsBitField(permissions)
      .toArray()
      .filter(p => !permissionsCurrent.some(pc => pc === p))
    return {
      content: `El bot no tiene permisos para ejecutar el ${type} ${nameInteraction}, los permisos requeridos son ${permissionsRequired
        .map(p => `\`${p}\``)
        .join(', ')}`
    }
  }
}
