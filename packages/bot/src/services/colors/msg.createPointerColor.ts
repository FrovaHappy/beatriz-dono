import BuildMessages from '@/core/build/BuildMessages'
import { Colors } from 'discord.js'

export default new BuildMessages({
  customId: 'service-createPointerColor',
  translates: {
    default: {
      embeds: [
        {
          title: 'The command color is not available',
          description: 'To activate it, you must have the server administrator role and give the bot button `setup`',
          color: Colors.DarkPurple
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: 'El comando color no disponible',
          description: 'Para activarlo, debes tener el rol de administrador del servidor y dale a el botón `setup`',
          color: Colors.DarkPurple
        }
      ]
    }
  },
  components: [[{ type: 'button', customId: 'colorPointer' }]]
})
