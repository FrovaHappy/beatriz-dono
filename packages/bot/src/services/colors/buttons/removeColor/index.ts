import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonBuilder, ButtonStyle } from 'discord.js'
import fetchColorCommand from '../../shared/fetchColorCommand'
import removeRoles from '../../shared/removeRoles'

export default new BuildButton({
  name: ButtonNames.removeColor,
  permissions: [],
  resolve: 'update',
  data: new ButtonBuilder().setLabel('Eliminar color').setStyle(ButtonStyle.Secondary),
  async execute(i) {
    const { guildId } = i
    if (!guildId) return { content: 'No se encontró el guild' }
    const roles = i.guild?.roles.cache
    const { colorPointerId, colors } = await fetchColorCommand(guildId, roles)
    if (!colorPointerId) return { content: 'No se encontró el puntero de colores' }

    const logDeleteRoles = await removeRoles(roles, colors, i)
    return {
      content: `Se eliminaron ${logDeleteRoles.total} roles de colores, falló ${logDeleteRoles.fails.length} roles`,
      components: []
    }
  }
})
