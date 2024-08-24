/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Colors,
  EmbedBuilder,
  type Interaction,
  type InteractionEditReplyOptions,
  type PermissionResolvable,
  PermissionsBitField
} from 'discord.js'
import formatterText from '@lib/formatterText'
import { getI18n } from '@/i18n'
interface Props {
  i: Interaction
  userName?: string
  customNameEmitted: string
  permissions: PermissionResolvable[]
}
export default async function isPermissionDeniedBot(props: Props): Promise<InteractionEditReplyOptions | undefined> {
  const { userName, customNameEmitted, permissions, i } = props
  const i18n = getI18n(i.locale, 'general')
  if (!i.guild?.members.me?.permissions.has(permissions)) {
    const PermissionsRequired = new PermissionsBitField(permissions)
      .toArray()
      .map(p => `\`\`${p}\`\``)
      .join(', ')
    return {
      embeds: [
        new EmbedBuilder({
          title: formatterText(i18n.errorPermissions.title, { slot0: `${customNameEmitted}}` }),
          color: Colors.Red,
          description: formatterText(i18n.errorPermissions.description, {
            slot0: PermissionsRequired,
            slot1: userName ?? 'Bot'
          })
        })
      ]
    }
  }
}
