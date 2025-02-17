import BuildMessages from '@/core/build/BuildMessages'
import { Colors } from 'discord.js'

export default new BuildMessages({
  default: {
    embeds: [
      {
        title: 'Oh no!',
        description: "You don't have access to this scope, is required the scope `{{slot0}}`",
        color: Colors.Orange
      }
    ]
  }
})
