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
  translates: {
    default: {
      name: 'Support me',
      style: ButtonStyle.Link,
      emoji: getEmoji('kofi')
    },
    'es-ES': {
      name: 'Apóyenme',
      style: ButtonStyle.Link,
      emoji: getEmoji('kofi')
    }
  },
  cooldown: 0,
  execute: async i => {
    return undefined
  }
})
