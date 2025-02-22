import { getEmoji } from '@/const/emojis'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonStyle } from 'discord.js'

export default new BuildButton({
  customId: 'linkKofi',
  scope: 'public',
  permissionsBot: [],
  url: config.setting.linkKofi,
  permissionsUser: [],
  resolve: 'update',
  style: ButtonStyle.Link,
  translates: {
    default: {
      name: 'Support me',
      emoji: getEmoji('kofi')
    },
    'es-ES': {
      name: 'Apóyenme',
      emoji: getEmoji('kofi')
    }
  },
  cooldown: 0,
  execute: async i => {
    return undefined
  }
})
