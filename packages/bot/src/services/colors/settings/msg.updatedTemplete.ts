import BuildMessages from '@/core/build/BuildMessages'

export default new BuildMessages({
  customId: 'service-updatedTemplate',
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
