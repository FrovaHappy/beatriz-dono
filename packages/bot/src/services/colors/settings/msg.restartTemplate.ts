import BuildMessages from '@/core/build/BuildMessages'

export default new BuildMessages({
  customId: 'service-restartTemplate',
  translates: {
    default: {
      embeds: [
        {
          description: 'The template has been restarted successfully.'
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          description: 'La plantilla se ha reiniciado correctamente.'
        }
      ]
    }
  }
})
