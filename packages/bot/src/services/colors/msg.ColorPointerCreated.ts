import BuildMessages from '@/core/build/BuildMessages'
import { Colors } from 'discord.js'

export default new BuildMessages({
  customId: 'service-colorPointerCreated',
  translates: {
    default: {
      embeds: [
        {
          title: 'Color Pointer created',
          description:
            'The color pointer role was created successfully. Now you can adjust the parameters of the module',
          color: Colors.Green
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: 'Color Pointer creado',
          description: 'El rol de color pointer fue creado con éxito. Ahora puedes ajustar los parámetros del modulo',
          color: Colors.Green
        }
      ]
    }
  },
  components: [[{ type: 'button', customId: 'setting' }]]
})
