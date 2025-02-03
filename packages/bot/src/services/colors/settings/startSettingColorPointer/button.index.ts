import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonBuilder, ButtonStyle, resolveColor } from 'discord.js'
import db from '@/core/database'
import messages, { messagesColors } from '@/messages'

export default new BuildButton({
  name: ButtonNames.startColor,
  scope: 'public',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  resolve: 'update',
  cooldown: 15,
  data: new ButtonBuilder().setLabel('Start').setStyle(ButtonStyle.Primary),
  execute: async i => {
    const { guildId, locale } = i
    if (!guildId) return messages.guildIdNoFound(locale)
    const { pointer_id } = await db.colors.read(guildId)
    const colorPointerId = i.guild?.roles.cache.get(pointer_id ?? '0')?.id

    if (!colorPointerId) {
      const role = await i.guild?.roles.create({
        name: "⚠️ Color Pointer - [don't delete]",
        hoist: false,
        color: resolveColor('#f75b00'),
        permissions: '0'
      })
      if (!role) return messagesColors.startSettingColorPointer.errorCreatingRole(locale)
      await db.colors.update({
        guild_id: guildId,
        pointer_id: role.id
      })
    }
    return messagesColors.startSettingColorPointer.success(locale)
  }
})
