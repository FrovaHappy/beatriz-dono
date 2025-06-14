import BuildMessages from '@/core/build/BuildMessages'
import { resolveColor } from 'discord.js'

export default new BuildMessages({
  customId: 'service-colorChanged',
  translates: {
    default: {
      embeds: [
        {
          title: 'Color changed',
          description: 'Your color has been changed to <@&{{slot0}}>',
          color: resolveColor('#0099ff')
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: 'Color cambiado',
          description: 'Tu color ha sido cambiado a <@&{{slot0}}>',
          color: resolveColor('#0099ff')
        }
      ]
    }
  }
})
