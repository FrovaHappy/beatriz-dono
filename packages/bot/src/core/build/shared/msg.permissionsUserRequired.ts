import { Colors } from 'discord.js'
import BuildMessages from '../BuildMessages'

export default new BuildMessages({
  customId: 'global-permissionsUserRequired',
  translates: {
    default: {
      embeds: [
        {
          title: 'Missing permissions for the user',
          description: 'The user requires the next permissions for functioning correctly:\n{{slot0}}',
          color: Colors.Red
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: 'Permisos faltantes para el usuario',
          description: 'El usuario requiere los siguientes permisos para funcionar correctamente:\n{{slot0}}',
          color: Colors.Red
        }
      ]
    }
  }
})
