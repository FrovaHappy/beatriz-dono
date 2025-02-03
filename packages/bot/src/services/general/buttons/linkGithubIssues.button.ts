import { getEmoji } from '@/const/emojis'
import { ButtonNames } from '@/const/interactionsNames'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonBuilder, ButtonStyle } from 'discord.js'

export default new BuildButton({
  name: ButtonNames.linkGithubIssues,
  scope: 'private',
  permissionsBot: [],
  isLink: true,
  data: new ButtonBuilder()
    .setURL(`${config.setting.linkGithub}/issues`)
    .setLabel('Report an issue')
    .setStyle(ButtonStyle.Link)
    .setEmoji(getEmoji('githubIssue')),
  cooldown: 0,
  execute: async i => {
    return undefined
  }
})
