import { MenuNames } from '@/const/interactionsNames'
import BuildMenu from '@/core/build/BuildMenu'
import { RoleSelectMenuBuilder, SelectMenuBuilder, StringSelectMenuInteraction } from 'discord.js'
import fetchColorCommand from './shared/fetchColorCommand'

export default new BuildMenu<'role'>({
  name: MenuNames.settingDeleteAsomeColors,
  ephemeral: true,
  resolve: 'update',
  scope: 'public',
  cooldown: 15,
  data: new RoleSelectMenuBuilder().setMinValues(1).setMaxValues(10).setPlaceholder('Select a role'),
  permissions: [],
  async execute(i) {
    const { guildId } = i
    if (!guildId) return { content: 'Guild not found' }
    const { colorPointerId, colors } = await fetchColorCommand(guildId, i.guild?.roles.cache)
    if (!colorPointerId) return { content: 'No se encontró el color pointer' }

    const values = i.values
    const roles = i.guild?.roles.cache

    const colorsRemove = colors.filter(
      color => roles?.get(color.roleId)?.id === values.find(value => value === color.roleId)
    )

    return {
      content: `Se eliminaron ${colorsRemove.length} roles de colores`
    }
  }
})
