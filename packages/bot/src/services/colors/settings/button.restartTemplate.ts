import BuildButton from '@/core/build/BuildButtons'
import db from '@db'
import { validate } from '@libs/schemas/colorsTemplete'
import { ButtonStyle } from 'discord.js'
import msgCreatePointerColor from '../msg.createPointerColor'
import msgRestartTemplate from './msg.restartTemplate'

export default new BuildButton({
  customId: 'settingRestartTemplate',
  scope: 'public',
  permissionsBot: ['ManageRoles'],
  permissionsUser: ['ManageRoles'],
  resolve: 'update',
  style: ButtonStyle.Secondary,
  translates: {
    default: {
      name: 'Restart Template'
    },
    'es-ES': {
      name: 'Reiniciar Plantilla'
    }
  },
  async execute(i) {
    const { guildId, locale } = i
    if (!guildId) throw new Error('Guild ID not found')
    const roles = i.guild?.roles.cache
    const query = await db.colors.read({ guild_id: guildId })
    if (!query) throw new Error('error in query Database')
    const { pointer_id, templete } = query
    const colorPointerId = pointer_id ?? roles?.first()?.id
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})
    if (!templete) return msgRestartTemplate.getMessage(locale, {})

    const restartTemplate = validate(templete)
    if (restartTemplate.error) return msgRestartTemplate.getMessage(locale, {})
    restartTemplate.data.colors = []
    // update database
    await db.colorsSettings.update({ guild_id: guildId, templete: JSON.stringify(restartTemplate.data) })
    return msgRestartTemplate.getMessage(locale, {})
  }
})
