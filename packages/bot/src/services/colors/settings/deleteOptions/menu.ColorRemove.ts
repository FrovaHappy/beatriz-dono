import { MenuNames } from '@/const/interactionsNames'
import BuildMenu from '@/core/build/BuildMenu'
import { ActionRowBuilder, Collection, StringSelectMenuBuilder } from 'discord.js'
import fetchColorCommand from '../../shared/fetchColorCommand'
import { removeRolesOfDb, removeRolesOfServer } from '../../shared/removeRoles'
import messages, { messagesColors } from '@/messages'

enum DeleteColors {
  deleteAll = 'delete-all',
  deleteAsome = 'delete-asome',
  deleteNotUsed = 'delete-not-used'
}

export default new BuildMenu({
  name: MenuNames.settingColorRemove,
  resolve: 'update',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  data: new StringSelectMenuBuilder({
    placeholder: 'Delete the colors'
  }).addOptions(
    { label: 'Delete all colors', value: DeleteColors.deleteAll },
    { label: 'Delete asome color', value: DeleteColors.deleteAsome },
    { label: 'Delete colors not used', value: DeleteColors.deleteNotUsed }
  ),
  execute: async i => {
    const { guildId, locale } = i
    const value = i.values[0] as DeleteColors
    const roles = i.guild?.roles.cache ?? new Collection()
    if (!guildId) return messages.guildIdNoFound(locale)
    const { colors, colorPointerId } = await fetchColorCommand(guildId, roles)
    if (!colorPointerId) return messagesColors.initColorPointer(locale)

    if (value === DeleteColors.deleteAll) {
      return messagesColors.settingsColorsDelete.deleteAll(locale)
    }
    if (value === DeleteColors.deleteAsome) {
      return messagesColors.settingsColorsDelete.deleteAsome(locale)
    }
    if (value === DeleteColors.deleteNotUsed) {
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
