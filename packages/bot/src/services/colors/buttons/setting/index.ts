import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import db from '@/core/db'
import { ButtonBuilder, ButtonStyle, resolveColor } from 'discord.js'
import fetchColorCommand from '../../shared/fetchColorCommand'

export default new BuildButton({
  name: ButtonNames.setting,
  permissions: ['ManageRoles'],
  cooldown: 15,
  data: new ButtonBuilder().setCustomId('setting').setLabel('Configuración').setStyle(ButtonStyle.Primary),
  execute: async i => {
    const { guildId } = i
    if (!guildId) return { content: 'No se encontró el guild' }

    let { colorPointerId } = await fetchColorCommand(guildId, i.guild?.roles.cache)

    if (!colorPointerId) {
      const role = await i.guild?.roles.create({
        name: '⚠️ Color Controller (Beatriz-Dono)',
        hoist: false,
        color: resolveColor('#f75b00'),
        permissions: '0'
      })
      if (!role) return { content: 'No se pudo crear el puntero de los colores' }
      await db.colorCommand.update({
        where: { serverId: guildId },
        data: {
          colorPointerId: role.id
        }
      })
      colorPointerId = role.id
      return {
        content: `se detecto la primera ejecución, por favor, mueve el rol <@&${role.id}> a una posición superior por debajo del rol del bot`
      }
    }

    return { content: 'Configuración', components: [] }
  }
})
