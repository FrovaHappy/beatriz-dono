import { getEmoji } from '@/const/emojis'
import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonBuilder, ButtonStyle } from 'discord.js'

export default new BuildButton({
  name: ButtonNames.linkKofi,
  scope: 'public',
  permissionsBot: [],
  isLink: true,
  data: new ButtonBuilder()
    .setURL(config.setting.linkKofi)
    .setLabel('Support me')
    .setStyle(ButtonStyle.Link)
    .setEmoji(getEmoji('kofi')),
  cooldown: 0,
  execute: async i => {
    return undefined
  }
})
