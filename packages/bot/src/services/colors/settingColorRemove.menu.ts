import { MenuNames } from '@/const/interactionsNames'
import BuildMenu from '@/core/build/BuildMenu'
import { ActionRowBuilder, Collection, StringSelectMenuBuilder } from 'discord.js'
import guildErrorMessage from '../shared/guildError.message'
import fetchColorCommand from './shared/fetchColorCommand'
import messageErrorColorPointer from './shared/message.errorColorPointer'
import { removeRolesOfServer, removeRolesOfDb } from './shared/removeRoles'

export default new BuildMenu({
  name: MenuNames.settingColorRemove,
  resolve: 'defer',
  permissions: [],
  data: new StringSelectMenuBuilder({
    placeholder: 'Delete the colors'
  }).addOptions(
    { label: 'Delete all colors', value: 'delete-all' },
    { label: 'Delete asome color', value: 'delete-asome' },
    { label: 'Delete colors not used', value: 'delete-not-used' }
  ),
  execute: async i => {
    const { guildId } = i
    const value = i.values[0] as 'delete-all' | 'delete-asome' | 'delete-not-used'
    const roles = i.guild?.roles.cache ?? new Collection()
    if (!guildId) return guildErrorMessage(i.locale)
    const { colors, colorPointerId } = await fetchColorCommand(guildId, roles)
    if (!colorPointerId) return messageErrorColorPointer(i.locale)

    if (value === 'delete-all') {
      const logDeleteRoles = await removeRolesOfServer(roles, colors, i)
      await removeRolesOfDb(roles, colors, i)
      return {
        content: `Se eliminaron ${colors.length} roles de colores, falló ${logDeleteRoles.fails.length} roles`,
        components: []
      }
    }
    if (value === 'delete-asome') {
      return {
        content: 'delete asome color',
        components: [new ActionRowBuilder().addComponents(menus.get(MenuNames.settingDeleteAsomeColors).data)]
      }
    }
    if (value === 'delete-not-used') {
      const colorsUnused = colors.filter(color => !roles.get(color.roleId))
      const rolesUnused = colors.filter(color => roles.get(color.roleId)?.members.size === 0)
      await removeRolesOfServer(roles, rolesUnused, i)
      await removeRolesOfDb(roles, [...colorsUnused, ...rolesUnused], i)
      return {
        content: `Se eliminaron ${rolesUnused.length + colorsUnused.length} roles de colores of ${colors.length} colores.`
      }
    }
  }
})
