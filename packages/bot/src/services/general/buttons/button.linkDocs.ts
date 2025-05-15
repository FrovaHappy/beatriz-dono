import { getEmoji } from '@/const/emojis'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonStyle } from 'discord.js'

export default new BuildButton({
  customId: 'linkDocumentation',
  scope: 'free',
  permissionsBot: [],
  permissionsUser: [],
  resolve: 'update',
  url: config.setting.linkDocumentation,
  style: ButtonStyle.Link,
  translates: {
    default: {
      name: 'Documentation',
      emoji: getEmoji('book')
    },
    'es-ES': {
      name: 'Documentación',
      emoji: getEmoji('book')
    }
  },
  cooldown: 0,
  execute: async i => {
    return undefined
  }
})
