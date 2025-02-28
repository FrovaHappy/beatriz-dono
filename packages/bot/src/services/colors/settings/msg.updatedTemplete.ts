import BuildMessages from '@/core/build/BuildMessages'

export default new BuildMessages({
  translates: {
    default: {
      embeds: [
        {
          title: 'Template updated',
          description: 'The template has been updated successfully.'
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: 'Plantilla actualizada',
          description: 'La plantilla ha sido actualizada correctamente.'
        }
      ]
    }
  }
})
