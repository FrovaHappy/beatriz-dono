import BuildMessages from '@/core/build/BuildMessages'
import { Colors } from 'discord.js'

export default new BuildMessages({
  default: {
    embeds: [
      {
        title: 'All colors deleted',
        description: 'A total of {{slot0}} colors were deleted',
        color: Colors.Green
      }
    ]
  },
  'es-ES': {
    embeds: [
      {
        title: 'Todos los colores eliminados',
        description: 'Se eliminaron un total de {{slot0}} colores',
        color: Colors.Green
      }
    ]
  }
})
