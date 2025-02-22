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
  style: ButtonStyle.Link,
  translates: {
    default: {
      name: 'Report an issue',
      emoji: getEmoji('githubIssue')
    },
    'es-ES': {
      name: 'Reportar un problema',
      emoji: getEmoji('githubIssue')
    }
  },
  cooldown: 0,
  execute: async i => {
    return undefined
  }
})
