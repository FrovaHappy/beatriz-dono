import { getEmoji } from '@/const/emojis'
import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonBuilder, ButtonStyle } from 'discord.js'

export default new BuildButton({
  customId: 'linkDiscord',
  scope: 'public',
  permissionsBot: [],
  permissionsUser: [],
  resolve: 'update',
  url: config.setting.linkDiscord,
  translates: {
    default: {
      name: 'Join Discord',
      style: ButtonStyle.Link,
      emoji: getEmoji('kannaAwave')
    },
    'es-ES': {
      name: 'Unite a Discord',
      style: ButtonStyle.Link,
      emoji: getEmoji('kannaAwave')
    }
  },
  cooldown: 0,
  execute: async i => {
    return undefined
  }
})
