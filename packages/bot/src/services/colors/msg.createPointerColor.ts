import BuildMessages from '@/core/build/BuildMessages'
import { ActionRowBuilder, type ButtonBuilder, Colors } from 'discord.js'

export default new BuildMessages({
  default: {
    embeds: [
      {
        title: 'The command color is not available',
        description: 'To activate it, you must have the server administrator role and give the bot button `setup`',
        color: Colors.DarkPurple
      }
    ],
    components: [new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.get('setup').data)]
  },
  'es-ES': {
    embeds: [
      {
        title: 'El comando color no disponible',
        description: 'Para activarlo, debes tener el rol de administrador del servidor y dale a el botón `setup`',
        color: Colors.DarkPurple
      }
    ],
    components: [new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.get('setup').data)]
  }
})
