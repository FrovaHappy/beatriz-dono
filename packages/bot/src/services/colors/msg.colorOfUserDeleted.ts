import BuildMessages from '@/core/build/BuildMessages'
import { Colors } from 'discord.js'

export default new BuildMessages({
  customId: 'service-colorOfUserDeleted',
  translates: {
    default: {
      embeds: [
        {
          title: 'The color of your user has been deleted!',
          description: 'There are {{slot0}} colors linked to your user!\nNow we paint again?',
          color: Colors.Green
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: '¡El color de tu usuario ha sido eliminado!',
          description:
            '¡Se han encontrado un total de {{slot0}} colores ligados a tu usuario!\n¿Ahora nos pintamos de nuevo?',
          color: Colors.Green
        }
      ]
    }
  }
})
