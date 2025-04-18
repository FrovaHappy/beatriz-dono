import BuildMenu from '@/core/build/BuildMenu'
import db from '@/database'
import msgCreatePointerColor from '../../msg.createPointerColor'

export default new BuildMenu<'role'>({
  customId: 'settingsConfirmDeleteAsome',
  maxValues: 10,
  minValues: 1,
  typeData: 'role',
  translates: {
    default: {
      placeholder: 'Select the roles you want to delete'
    },
    'es-ES': {
      placeholder: 'Selecciona los roles que quieres eliminar'
    }
  },
  ephemeral: true,
  resolve: 'update',
  scope: 'public',
  cooldown: 15,
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  async execute(i) {
    const { guildId, values, locale } = i
    const roles = i.guild?.roles.cache
    if (!guildId) throw new Error('Guild ID not found')

    const query = await db.colors.read({ guild_id: guildId })
    if (!query) throw new Error('error in query Database')
    const { colors, pointer_id } = query
    const colorPointerId = roles?.get(pointer_id ?? '0')?.id
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})

    const colorsRemove = colors.filter(
      color => roles?.get(color.role_id)?.id === values.find(value => value === color.role_id)
    )

    return {
      content: `Se eliminaron ${colorsRemove.length} roles de colores`
    }
  }
})
