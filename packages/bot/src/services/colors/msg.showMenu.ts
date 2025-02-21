import BuildMessages from '@/core/build/BuildMessages'
import { Colors } from 'discord.js'

export default new BuildMessages({
  default: {
    embeds: [
      {
        title: 'Color Module',
        description: 'Select a color to change the color of the role\n> current color: {{slot0}}',
        color: Colors.Grey
      }
    ],
    components: [
      [
        { type: 'button', customId: 'colorCast' },
        { type: 'button', customId: 'deleteColor' },
        { type: 'button', customId: 'setting' }
      ]
    ]
  },
  'es-ES': {
    embeds: [
      {
        title: 'Módulo de Colores',
        description: 'Selecciona un color para cambiar el color del rol\n> color actual: {{slot0}}',
        color: Colors.Grey
      }
    ],
    components: [
      [
        { type: 'button', customId: 'colorCast' },
        { type: 'button', customId: 'deleteColor' },
        { type: 'button', customId: 'setting' }
      ]
    ]
  }
})
