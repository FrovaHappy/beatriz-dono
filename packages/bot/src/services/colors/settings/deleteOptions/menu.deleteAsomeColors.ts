import { MenuNames } from '@/const/interactionsNames'
import BuildMenu from '@/core/build/BuildMenu'
import { RoleSelectMenuBuilder } from 'discord.js'
import fetchColorCommand from '../../shared/fetchColorCommand'
import messages, { messagesColors } from '@/messages'

export default new BuildMenu<'role'>({
  name: MenuNames.settingDeleteAsomeColors,
  ephemeral: true,
  resolve: 'update',
  scope: 'public',
  cooldown: 15,
  data: new RoleSelectMenuBuilder().setMinValues(1).setMaxValues(10).setPlaceholder('Select a role'),
  permissions: [],
  async execute(i) {
    const { guildId, values, locale } = i
    const roles = i.guild?.roles.cache
    if (!guildId) return messages.guildIdNoFound(locale)

    const { colorPointerId, colors } = await fetchColorCommand(guildId, roles)
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

    const colorsRemove = colors.filter(
      color => roles?.get(color.roleId)?.id === values.find(value => value === color.roleId)
    )

    return {
      content: `Se eliminaron ${colorsRemove.length} roles de colores`
    }
  }
})
