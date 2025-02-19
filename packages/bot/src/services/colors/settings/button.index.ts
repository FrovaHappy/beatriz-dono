import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonBuilder, ButtonStyle } from 'discord.js'
import messages, { messagesColors } from '@/messages'
import db from '@/database'

export default new BuildButton({
  name: 'setting',
  scope: 'public',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  resolve: 'update',
  data: new ButtonBuilder().setCustomId('setting').setLabel('Configuración').setStyle(ButtonStyle.Primary),
  execute: async i => {
    const { guildId, locale } = i
    const roles = i.guild?.roles.cache
    if (!guildId) return messages.guildIdNoFound(locale)
    const { pointer_id } = await db.colors.read(guildId)
    const colorPointerId = roles?.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

    return messagesColors.setting(locale)
  }
})
