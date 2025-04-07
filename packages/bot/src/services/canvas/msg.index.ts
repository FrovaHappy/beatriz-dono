import BuildMessages from '@/core/build/BuildMessages'

export default new BuildMessages({
  translates: {
    default: {
      embeds: [
        {
          title: 'Canvas Menu',
          description: 'In the following options you can manipulate the canvases associated to your server',
          color: 0x00ff00
        }
      ]
    },
    'es-ES': {
      embeds: [
        {
          title: 'Menu de Canvas',
          description: 'En las siguientes opciones tienes de manipular los canvas asociados a tu servidor',
          color: 0x00ff00
        }
      ]
    }
  },
  components: [[{ type: 'button', customId: 'setup' }]] // agregara un botón al mensaje
})
