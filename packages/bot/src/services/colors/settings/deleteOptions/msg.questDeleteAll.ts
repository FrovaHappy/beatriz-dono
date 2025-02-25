import BuildMessages from '@/core/build/BuildMessages'
import { Colors } from 'discord.js'

export default new BuildMessages({
  translates: {
    default: {
      embeds: [
        {
          title: 'All colors deleted',
          description: 'Really want to delete all colors?',
          color: Colors.Orange
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: 'Se eliminaron todos los colores',
          description: 'Realmente quieres eliminar todos los colores?',
          color: Colors.Orange
        }
      ]
    }
  },
  components: [[{ type: 'button', customId: 'settingsConfirmDeleteAll' }]]
})
