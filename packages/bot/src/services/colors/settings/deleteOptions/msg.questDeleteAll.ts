import BuildMessages from '@/core/build/BuildMessages'
import { Colors } from 'discord.js'

export default new BuildMessages({
  default: {
    embeds: [
      {
        title: 'All colors deleted',
        description: 'Really want to delete all colors?',
        color: Colors.Orange
      }
    ],
    components: [[{ type: 'button', customId: 'settingsConfirmDeleteAll' }]]
  },
  'es-ES': {
    embeds: [
      {
        title: 'Se eliminaron todos los colores',
        description: 'Realmente quieres eliminar todos los colores?',
        color: Colors.Orange
      }
    ],
    components: [[{ type: 'button', customId: 'settingsConfirmDeleteAll' }]]
  }
})
