import BuildMessages from '@/core/build/BuildMessages'

export default new BuildMessages({
  translates: {
    default: {
      embeds: [
        {
          title: 'The data has an error',
          description: `
          Please check the data sent, now we leave the error and information to solve it according to the case:\n# {{slot0}} \n{{slot1}}\n\n you can review these links for more information:\n[Json Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)\n[Bot Documentation](${config.setting.linkDocumentation}/docs/en/modules/colors)
          `
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: 'Los datos Enviados tienen un Problema',
          description: `
          Por favor, comprueba los datos enviados, ahora te dejamos el error y información para solucionarlo según el caso:\n# {{slot0}} \n{{slot1}}\n\n puedes revisar estos links para más información:\n[Documentación de Json](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON)\n[Documentacion del Bot](${config.setting.linkDocumentation}/docs/es/modules/colors)
          `
        }
      ]
    }
  }
})
