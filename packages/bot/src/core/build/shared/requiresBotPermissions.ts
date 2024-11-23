import messages from '@/messages'
import type { MessageOptions } from '@/types/main'
import { type GuildMember, type Locale, type PermissionResolvable, PermissionsBitField } from 'discord.js'

interface Props {
  permissions: PermissionResolvable[]
  bot: GuildMember
  type: string
  locale: Locale
}
/**
 * @returns `undefined` if the bot has the permissions and `MessageOptions` if not
 */
export default function requiresBotPermissions(props: Props): MessageOptions | undefined {
  const { permissions, bot, type, locale } = props

  if (!bot) return { content: 'No se encontró el bot' }

  const permissionsCurrent = new PermissionsBitField(bot.permissions).toArray()

  if (!bot.permissions.has(permissions)) {
    const permissionsRequired = new PermissionsBitField(permissions)
      .toArray()
      .filter(p => !permissionsCurrent.some(pc => pc === p))
    return messages.errorPermissions(locale, type, permissionsRequired, 'bot')
  }
}
