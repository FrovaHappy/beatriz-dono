import BuildMessages from '@/core/build/BuildMessages'

export default new BuildMessages({
  customId: 'service-colorIncorrect',
  translates: {
    default: {
      embeds: [
        {
          title: 'This color is incorrect',
          description: 'Please, use a valid color code #RRGGBB\ninput: `{{slot0}}`'
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: 'Este color es incorrecto',
          description: 'Por favor, usa un código de color #RRGGBB\ninput: `{{slot0}}`'
        }
      ]
    }
  }
})
