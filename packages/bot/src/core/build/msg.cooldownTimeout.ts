import { Colors } from 'discord.js'
import BuildMessages from './BuildMessages'

export default new BuildMessages({
  customId: 'global-cooldownTimeout',
  translates: {
    default: {
      embeds: [
        {
          title: 'you are too fast! ⏳',
          description:
            'Has been put a cooldown of {{slot0}} seconds. Wait <t:{{slot1}}:R> before using that command again.',
          color: Colors.Orange
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: 'Vas muy rápido! ⏳',
          description:
            'Te hemos puesto un cooldown de {{slot0}} segundos. Espera <t:{{slot1}}:R> antes de usar ese comando otra vez.',
          color: Colors.Red
        }
      ]
    }
  }
})
