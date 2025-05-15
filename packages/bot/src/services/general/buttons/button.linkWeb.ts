import { getEmoji } from '@/const/emojis'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonStyle } from 'discord.js'

export default new BuildButton({
  customId: 'linkWeb',
  scope: 'free',
  permissionsBot: [],
  permissionsUser: [],
  resolve: 'update',
  url: config.setting.linkWebsite,
  style: ButtonStyle.Link,
  translates: {
    default: {
      name: 'Website',
      emoji: getEmoji('drinkKanna')
    },
    'es-ES': {
      name: 'Sitio web',
      emoji: getEmoji('drinkKanna')
    }
  },
  cooldown: 0,
  execute: async i => {
    return undefined
  }
})
