import { getEmoji } from '@/const/emojis'
import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonBuilder, ButtonStyle } from 'discord.js'

export default new BuildButton({
  name: ButtonNames.linkDiscord,
  permissions: [],
  isLink: true,
  data: new ButtonBuilder()
    .setURL(config.linkDiscord)
    .setLabel('Join to Discord')
    .setStyle(ButtonStyle.Link)
    .setEmoji(getEmoji('kannaAwave')),
  cooldown: 0,
  execute: async i => {
    return undefined
  }
})
