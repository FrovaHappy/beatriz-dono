import { getEmoji } from '@/const/emojis'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonStyle } from 'discord.js'

export default new BuildButton({
  customId: 'linkDiscord',
  scope: 'free',
  permissionsBot: [],
  permissionsUser: [],
  resolve: 'update',
  url: config.setting.linkDiscord,
  style: ButtonStyle.Link,
  translates: {
    default: {
      name: 'Join Discord',
      emoji: getEmoji('kannaAwave')
    },
    'es-ES': {
      name: 'Unite a Discord',
      emoji: getEmoji('kannaAwave')
    }
  },
  cooldown: 0,
  execute: async i => {
    return undefined
  }
})
