import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, resolveColor } from 'discord.js'
import fetchColorCommand from '../../shared/fetchColorCommand'
import db from '@/core/db'
import messages, { messagesColors } from '@/messages'

export default new BuildButton({
  name: ButtonNames.startColor,
  scope: 'public',
  permissionsBot: ['ManageRoles'],
  resolve: 'update',
  cooldown: 15,
  data: new ButtonBuilder().setLabel('Start').setStyle(ButtonStyle.Primary),
  execute: async i => {
    const { guildId, locale } = i
    if (!guildId) return messages.guildIdNoFound(locale)
    let { colorPointerId } = await fetchColorCommand(guildId, i.guild?.roles.cache)

    if (!colorPointerId) {
      const role = await i.guild?.roles.create({
        name: "⚠️ Color Pointer - [don't delete]",
        hoist: false,
        color: resolveColor('#f75b00'),
        permissions: '0'
      })
      if (!role) return messagesColors.startSettingColorPointer.errorCreatingRole(locale)
      await db.colorCommand.update({
        where: { serverId: guildId },
        data: {
          colorPointerId: role.id
        }
      })
      colorPointerId = role.id
    }
    return messagesColors.startSettingColorPointer.success(locale)
  }
})
