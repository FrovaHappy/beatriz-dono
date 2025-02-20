import BuildMessages from '@/core/build/BuildMessages'
import { Colors } from 'discord.js'

export default new BuildMessages({
  default: {
    embeds: [
      {
        title: 'delete some colors',
        description: 'Please, select the colors you want to delete.',
        color: Colors.Orange
      }
    ],
    components: [[{ type: 'button', customId: 'settingsConfirmDeleteAsome' }]]
  },
  'es-ES': {
    embeds: [
      {
        title: 'elimina algunos colores',
        description: 'Por favor, selecciona los colores que quieres eliminar.',
        color: Colors.Orange
      }
    ],
    components: [[{ type: 'button', customId: 'settingsConfirmDeleteAsome' }]]
  }
})
