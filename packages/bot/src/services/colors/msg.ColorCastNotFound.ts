import BuildMessages from '@/core/build/BuildMessages'
import { Colors } from 'discord.js'

export default new BuildMessages({
  default: {
    embeds: [
      {
        title: 'Color not found',
        description:
          'The color could not be extracted from your profile picture. Try changing your user profile or change your user profile to a color image.',
        color: Colors.Yellow
      }
    ]
  },
  'es-ES': {
    embeds: [
      {
        title: 'Color no encontrado',
        description:
          'El color no se pudo extraer de tu foto de perfil. Intenta cambiar tu perfil de usuario o cambia tu perfil de usuario a una imagen de color.',
        color: Colors.Yellow
      }
    ]
  }
})
