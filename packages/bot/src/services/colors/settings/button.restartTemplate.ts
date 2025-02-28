import BuildButton from '@/core/build/BuildButtons'
import msgCreatePointerColor from '../msg.createPointerColor'
import db from '@db'
import { ButtonStyle } from 'discord.js'
import { validate } from '@libs/schemas/colorsTemplete'
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
    const { pointer_id, templete } = await db.colors.read(guildId)
    const colorPointerId = pointer_id ?? roles?.first()?.id
    if (!colorPointerId) return msgCreatePointerColor.getMessage(locale, {})
    if (!templete) return msgRestartTemplate.getMessage(locale, {})

    const restartTemplate = validate(templete)
    if (restartTemplate.error) return msgRestartTemplate.getMessage(locale, {})
    restartTemplate.data.colors = []
    console.log(restartTemplate.data)
    // update database
    await db.colors.update({ guild_id: guildId, templete: JSON.stringify(restartTemplate.data) })
    return msgRestartTemplate.getMessage(locale, {})
  }
})
