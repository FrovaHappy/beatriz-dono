/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionsBitField } from 'discord.js'
import messageFormatting from '../../shared/messageFormatting'
import getI18n from '../../i18n'
import type { Command } from '@core/build/BuildCommand'

export default async function hasPermissionsBot(i: ChatInputCommandInteraction, command: Command): Promise<boolean> {
  const i18n = getI18n(i.locale)
  if (!i.guild?.members.me?.permissions.has(command.permissions)) {
    const arrayPermissions = new PermissionsBitField(command.permissions)
      .toArray()
      .map(p => `\`\`${p}\`\``)
      .join(', ')
    i.user.send({
      embeds: [
        new EmbedBuilder({
          title: messageFormatting(i18n.general.errorPermissions.title, { slot0: `${command.name}}` }),
          color: Colors.Red,
          description: messageFormatting(i18n.general.errorPermissions.description, {
            slot0: arrayPermissions,
            slot1: i.client.user?.globalName ?? 'Bot'
          })
        })
      ]
    })
    return false
  }
  return true
}
