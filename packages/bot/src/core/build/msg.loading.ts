import emojis from '@/const/emojis'
import BuildMessages from './BuildMessages'

export default new BuildMessages({
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
