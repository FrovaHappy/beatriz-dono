import emojis from '@/const/emojis'
import BuildMessages from './BuildMessages'

export default new BuildMessages({
  customId: 'global-loading',
  translates: {
    default: {
      embeds: [
        {
          description: `${emojis.loading}`
        }
      ]
    }
  }
})
