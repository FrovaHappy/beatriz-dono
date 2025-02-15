import { MenuNames } from '@/const/interactionsNames'
import BuildMenu from '@/core/build/BuildMenu'
import { RoleSelectMenuBuilder } from 'discord.js'
import messages, { messagesColors } from '@/messages'
import db from '@/database'

export default new BuildMenu<'role'>({
  name: MenuNames.settingDeleteAsomeColors,
  ephemeral: true,
  resolve: 'update',
  scope: 'public',
  cooldown: 15,
  data: new RoleSelectMenuBuilder().setMinValues(1).setMaxValues(10).setPlaceholder('Select a role'),
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  async execute(i) {
    const { guildId, values, locale } = i
    const roles = i.guild?.roles.cache
    if (!guildId) return messages.guildIdNoFound(locale)

    const { pointer_id, colors } = await db.colors.read(guildId)
    const colorPointerId = roles?.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

    const colorsRemove = colors.filter(
      color => roles?.get(color.role_id)?.id === values.find(value => value === color.role_id)
    )

    return {
      content: `Se eliminaron ${colorsRemove.length} roles de colores`
    }
  }
})
