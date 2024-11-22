import type { MessageOptions } from '@/types/main'
import { Colors, type Locale } from 'discord.js'

export default function deleteColorUser(locale: Locale, colorsLength: number): MessageOptions {
  return {
    embeds: [
      {
        title: 'Color deleted',
        description: `The colors has been deleted from your profile. ${colorsLength} colors have been deleted.`,
        color: Colors.Green
      }
    ]
  }
}
