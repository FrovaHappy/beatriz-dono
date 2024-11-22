import messages from '@/messages'
import type { MessageOptions } from '@/types/main'
import {
  type APIInteractionGuildMember,
  type GuildMember,
  type Locale,
  type PermissionResolvable,
  PermissionsBitField
} from 'discord.js'

interface Props {
  permissions: PermissionResolvable[]
  user: GuildMember
  type: string
  locale: Locale
}
/**
 * @returns `undefined` if the bot has the permissions and `MessageOptions` if not
 */
export default function requiresBotPermissions(props: Props): MessageOptions | undefined {
  const { permissions, user, type, locale } = props

  const permissionsCurrent = user.permissions.toArray()

  if (!user.permissions.has(permissions)) {
    const permissionsRequired = new PermissionsBitField(permissions)
      .toArray()
      .filter(p => !permissionsCurrent.some(pc => pc === p))
    return messages.errorPermissions(locale, type, permissionsRequired)
  }
}
