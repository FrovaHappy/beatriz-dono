import BuildMessages from '@/core/build/BuildMessages'
import { Colors } from 'discord.js'

export default new BuildMessages({
  default: {
    embeds: [
      {
        title: 'Colors order',
        description: 'The colors order was updated successfully',
        color: Colors.Green
      }
    ]
  },
  'es-ES': {
    embeds: [
      {
        title: 'Orden de colores',
        description: 'El orden de colores fue actualizado con éxito',
        color: Colors.Green
      }
    ]
  }
})
