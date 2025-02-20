import { getEmoji } from '@/const/emojis'
import BuildButton from '@/core/build/BuildButtons'
import { ButtonStyle } from 'discord.js'

export default new BuildButton({
  customId: 'linkGithubIssues',
  scope: 'private',
  permissionsBot: [],
  permissionsUser: [],
  resolve: 'update',
  url: `${config.setting.linkGithub}/issues`,
  translates: {
    default: {
      name: 'Report an issue',
      style: ButtonStyle.Link,
      emoji: getEmoji('githubIssue')
    },
    'es-ES': {
      name: 'Reportar un problema',
      style: ButtonStyle.Link,
      emoji: getEmoji('githubIssue')
    }
  },
  cooldown: 0,
  execute: async i => {
    return undefined
  }
})
