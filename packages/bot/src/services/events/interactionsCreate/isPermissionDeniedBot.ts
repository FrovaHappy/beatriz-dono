/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Colors,
  EmbedBuilder,
  type Interaction,
  type InteractionEditReplyOptions,
  type PermissionResolvable,
  PermissionsBitField
} from 'discord.js'
import messageFormatting from '@/shared/messageFormatting'
import { type I18n } from '@/i18n'
interface Props {
  i: Interaction
  i18n: I18n
  userName?: string
  customNameEmitted: string
  permissions: PermissionResolvable[]
}
export default async function isPermissionDeniedBot(props: Props): Promise<InteractionEditReplyOptions | undefined> {
  const { i18n, userName, customNameEmitted, permissions, i } = props
  if (!i.guild?.members.me?.permissions.has(permissions)) {
    const PermissionsRequired = new PermissionsBitField(permissions)
      .toArray()
      .map(p => `\`\`${p}\`\``)
      .join(', ')
    return {
      embeds: [
        new EmbedBuilder({
          title: messageFormatting(i18n.general.errorPermissions.title, { slot0: `${customNameEmitted}}` }),
          color: Colors.Red,
          description: messageFormatting(i18n.general.errorPermissions.description, {
            slot0: PermissionsRequired,
            slot1: userName ?? 'Bot'
          })
        })
      ]
    }
  }
}
