import BuildMenu from '@/core/build/BuildMenu'
import { Collection } from 'discord.js'
import { removeRolesOfServer } from '../../shared/removeRoles'
import db from '@/database'
import msgCreatePointerColor from '../../msg.createPointerColor'
import msgQuestDeleteAll from './msg.questDeleteAll'
import msgQuestDeleteAsome from './msg.questDeleteAsome'

enum DeleteColors {
  deleteAll = 'delete-all',
  deleteAsome = 'delete-asome',
  deleteNotUsed = 'delete-not-used'
}

export default new BuildMenu<'string'>({
  customId: 'settingsDeleteColors',
  resolve: 'update',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  scope: 'public',
  typeData: 'string',
  translates: {
    default: {
      placeholder: 'Delete the colors',
      options: [
        { label: 'Delete all colors', value: DeleteColors.deleteAll },
        { label: 'Delete asome color', value: DeleteColors.deleteAsome },
        { label: 'Delete colors not used', value: DeleteColors.deleteNotUsed }
      ]
    },
    'es-ES': {
      placeholder: 'Eliminar los colores',
      options: [
        { label: 'Eliminar todos los colores', value: DeleteColors.deleteAll },
        { label: 'Eliminar algunos colores', value: DeleteColors.deleteAsome },
        { label: 'Eliminar colores no utilizados', value: DeleteColors.deleteNotUsed }
      ]
    }
  },
  execute: async i => {
    const { guildId, locale } = i
    const value = i.values[0] as DeleteColors
    const roles = i.guild?.roles.cache ?? new Collection()
    if (!guildId) throw new Error('Guild ID not found')
    const { colors, pointer_id } = await db.colors.read(guildId)
    const colorPointerId = roles?.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})

    if (value === DeleteColors.deleteAll) return msgQuestDeleteAll.getMessage(locale, {})
    if (value === DeleteColors.deleteAsome) return msgQuestDeleteAsome.getMessage(locale, {})
    if (value === DeleteColors.deleteNotUsed) {
      const colorsUnused = colors.filter(color => !roles.get(color.role_id))
      const rolesUnused = colors.filter(color => roles.get(color.role_id)?.members.size === 0)
      await removeRolesOfServer(roles, rolesUnused, i)
      await db.colors.delete(guildId, [...colorsUnused, ...rolesUnused])
      return {
        content: `Se eliminaron ${rolesUnused.length + colorsUnused.length} roles de colores of ${colors.length} colores.`
      }
    }
  }
})
