import COLORS from '@/const/colors'
import { MenuNames } from '@/const/interactionsNames'
import BuildMenu from '@/core/build/BuildMenu'
import { type GuildMemberRoleManager, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js'
import createColorRole from '../../shared/createColorRole'
import fetchColorCommand from '../../shared/fetchColorCommand'
import removeRoles from '../../shared/removeRoles'

export default new BuildMenu({
  name: MenuNames.colorDefault,
  menuType: 'string',
  resolve: 'defer',
  permissions: [],
  data: new StringSelectMenuBuilder({
    placeholder: 'Selecciona un color'
  }).addOptions(
    ...COLORS.map(color => {
      return new StringSelectMenuOptionBuilder().setValue(color.hexColor).setLabel(color.label).setEmoji(color.emoji)
    })
  ),
  execute: async i => {
    const { values, guildId } = i
    const roles = i.guild?.roles.cache
    if (!guildId) return { content: 'No se encontró el guild' }

    const colorSelected = values[0]
    const { colors, colorPointerId } = await fetchColorCommand(guildId, roles)
    if (!colorPointerId) return { content: 'No se encontró el puntero de los colores' }

    await removeRoles(roles, colors, i)
    const colorRole = await createColorRole({
      hexColor: colorSelected as `#${string}`,
      guildId,
      colors,
      colorPointerId,
      i
    })
    if (!colorRole) return { content: 'No se pudo crear el rol' }
    // eslint-disable-next-line space-unary-ops
    await (i.member?.roles as GuildMemberRoleManager).add(colorRole)
    const position = roles?.get(colorPointerId)?.rawPosition ?? 0
    await i.guild?.roles.setPosition(colorRole.id, position)
    return { content: `El color de tu nickname se ha cambiado a <@&${colorRole.id}>` }
  }
})
