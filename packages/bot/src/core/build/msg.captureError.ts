import { Colors } from 'discord.js'
import BuildMessages from './BuildMessages'

export default new BuildMessages({
  components: [
    [
      { type: 'button', customId: 'linkDiscord' },
      { type: 'button', customId: 'linkGithubIssues' }
    ]
  ],
  translates: {
    default: {
      embeds: [
        {
          title: 'Something went wrong',
          description:
            'We have detected an error in the server.\n this problem occurred in `{{slot0}}`\n You can open an issue in our support server or in github',
          color: Colors.Red
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: 'Algo salió mal',
          description:
            'Hemos detectado un error en el servidor.\n este problema se ocurrió en `{{slot0}}`\n Puedes abrir un issue en nuestro servidor de soporte o en github',
          color: Colors.Red
        }
      ]
    }
  }
})
