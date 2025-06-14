import { Colors } from 'discord.js'
import BuildMessages from '../BuildMessages'

export default new BuildMessages({
  customId: 'global-permissionsBotRequired',
  translates: {
    default: {
      embeds: [
        {
          title: 'Missing permissions for the bot',
          description: 'The bot requires the next permissions for functioning correctly:\n{{slot0}}',
          color: Colors.Red
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: 'Permisos faltantes para el bot',
          description: 'El bot requiere los siguientes permisos para funcionar correctamente:\n{{slot0}}',
          color: Colors.Red
        }
      ]
    }
  }
})
