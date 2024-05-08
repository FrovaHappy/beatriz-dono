/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Colors,
  EmbedBuilder,
  type Interaction,
  type InteractionEditReplyOptions,
  type PermissionResolvable,
  PermissionsBitField
} from 'discord.js'
import { type I18n } from '@/i18n'
import formatterText from '@lib/formatterText'
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
          title: formatterText(i18n.general.errorPermissions.title, { slot0: `${customNameEmitted}}` }),
          color: Colors.Red,
          description: formatterText(i18n.general.errorPermissions.description, {
            slot0: PermissionsRequired,
            slot1: userName ?? 'Bot'
          })
        })
      ]
    }
  }
}
