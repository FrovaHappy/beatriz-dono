import BuildMessages from '@/core/build/BuildMessages'
import { Colors } from 'discord.js'

export default new BuildMessages({
  components: [[{ type: 'button', customId: 'linkDiscord' }]],
  translates: {
    default: {
      embeds: [
        {
          title: 'Oh no!',
          description:
            "You don't have access to this scope, is required the scope `{{slot0}}`\n You can request access in our support server",
          color: Colors.Orange
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: '¡Oh no!',
          description:
            'No tienes acceso a este scope, es necesario el scope `{{slot0}}`\n Puedes pedir acceso en nuestro servidor de soporte',
          color: Colors.Orange
        }
      ]
    }
  }
})
