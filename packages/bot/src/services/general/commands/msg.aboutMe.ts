import BuildMessages from '@/core/build/BuildMessages'
import { Colors } from 'discord.js'

export default new BuildMessages({
  components: [
    [
      { type: 'button', customId: 'linkWeb' },
      { type: 'button', customId: 'linkDocumentation' }
    ]
  ],
  translates: {
    default: {
      embeds: [
        {
          title: 'About me',
          description:
            'I am a bot that helps you make your servers more fun. If you want to know more, you can consult my website or our documentation.',
          color: Colors.Grey
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: 'Sobre mí',
          description:
            'Soy un bot que te ayuda a hacer tus servidores más divertidos. si quieres saber más, puedes consultar mi página web o nuestra documentación.',
          color: Colors.Grey
        }
      ]
    }
  }
})
