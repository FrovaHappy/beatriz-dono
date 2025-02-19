import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonBuilder, ButtonStyle, resolveColor } from 'discord.js'
import db from '@/database'
import messages, { messagesColors } from '@/messages'
import msgColorPointerCreated from './msg.ColorPointerCreated'

export default new BuildButton({
  name: 'startColors',
  scope: 'public',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  resolve: 'update',
  cooldown: 15,
  data: new ButtonBuilder().setLabel('Start').setStyle(ButtonStyle.Primary),
  execute: async i => {
    const { guildId, locale } = i
    if (!guildId) throw new Error('Guild ID not found')
    const { pointer_id } = await db.colors.read(guildId)
    const colorPointerId = i.guild?.roles.cache.get(pointer_id ?? '0')?.id

    if (!colorPointerId) {
      const role = await i.guild?.roles.create({
        name: "⚠️ Color Pointer - [don't delete]",
        hoist: false,
        color: resolveColor('#f75b00'),
        permissions: '0'
      })
      if (!role) throw new Error('Role not created, see permissions')
      await db.colors.update({
        guild_id: guildId,
        pointer_id: role.id
      })
    }
    return msgColorPointerCreated.getMessage(locale, {})
  }
})
