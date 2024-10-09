import { CommandNames } from '@/const/interactionsNames'
import { getI18n } from '@/i18n'
import type { MessageOptions } from '@/types/main'
import formatterText from '@libs/formatterText'
import {
  Colors,
  EmbedBuilder,
  type GuildMember,
  type Locale,
  type PermissionResolvable,
  PermissionsBitField
} from 'discord.js'

interface Props {
  permissions: PermissionResolvable[]
  bot: GuildMember | null | undefined
  nameInteraction: string
  type: string
  locale: Locale
}
/**
 * @returns `undefined` if the bot has the permissions and `MessageOptions` if not
 */
export default function requiresBotPermissions(props: Props): MessageOptions | undefined {
  const { permissions, bot, nameInteraction, type, locale } = props
  const i18n = getI18n(locale, 'general')

  if (!bot) return { content: 'No se encontró el bot' }

  const permissionsCurrent = new PermissionsBitField(bot.permissions).toArray()

  if (!bot.permissions.has(permissions)) {
    const permissionsRequired = new PermissionsBitField(permissions)
      .toArray()
      .filter(p => !permissionsCurrent.some(pc => pc === p))
    return {
      embeds: [
        new EmbedBuilder({
          title: i18n.errorPermissionBot.title,
          description: formatterText(i18n.errorPermissionBot.description, { slot0: type }),
          fields: [
            {
              name: i18n.errorPermissionBot.fields.name,
              value: permissionsRequired.map(p => `**•** \`${p}\``).join('\n')
            }
          ],
          color: Colors.Red,
          footer: { text: i18n.errorPermissionBot.footer }
        })
      ]
    }
  }
}
