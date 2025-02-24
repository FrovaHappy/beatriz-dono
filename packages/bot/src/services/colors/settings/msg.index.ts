import BuildMessages from '@/core/build/BuildMessages'
import { Colors } from 'discord.js'

export default new BuildMessages({
  components: [
    [{ type: 'menu', customId: 'settingsDeleteColors' }],
    [
      { type: 'modal', customId: 'editColorsTemplate' },
      { type: 'button', customId: 'orderColors' }
    ]
  ],
  translates: {
    default: {
      embeds: [
        {
          title: 'Colors Settings',
          description: 'Here you can manage your colors settings',
          color: Colors.Blue
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: 'Configuración de colores',
          description: 'Aquí puedes gestionar tus configuraciones de colores',
          color: Colors.Blue
        }
      ]
    }
  }
})
