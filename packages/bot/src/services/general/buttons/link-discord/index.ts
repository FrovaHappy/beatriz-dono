import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonBuilder, ButtonStyle } from 'discord.js'

export default new BuildButton({
  name: ButtonNames.linkDiscord,
  permissions: [],
  data: new ButtonBuilder().setURL(config.linkDiscord).setLabel('Join to Discord').setStyle(ButtonStyle.Link),
  cooldown: 0,
  execute: async i => {
    return undefined
  }
})
