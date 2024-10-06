import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonBuilder, ButtonStyle } from 'discord.js'
import fetchColorCommand from '../shared/fetchColorCommand'
import { removeRolesOfUser } from '../shared/removeRoles'
import guildErrorMessage from '@/services/shared/guildError.message'
import messageErrorColorPointer from '../shared/message.errorColorPointer'

export default new BuildButton({
  name: ButtonNames.removeColor,
  permissions: [],
  resolve: 'update',
  data: new ButtonBuilder().setLabel('Eliminar color').setStyle(ButtonStyle.Secondary),
  async execute(i) {
    const { guildId } = i
    if (!guildId) return guildErrorMessage(i.locale)
    const roles = i.guild?.roles.cache
    const { colorPointerId, colors } = await fetchColorCommand(guildId, roles)
    if (!colorPointerId) return messageErrorColorPointer(i.locale)

    const logDeleteRoles = await removeRolesOfUser(roles, colors, i)
    return {
      content: `Se eliminaron ${logDeleteRoles.total} roles de colores, falló ${logDeleteRoles.fails.length} roles`,
      components: []
    }
  }
})
