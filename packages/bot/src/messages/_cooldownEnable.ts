import { Colors, type Locale } from 'discord.js'

export default function cooldownEnable(locale: Locale, cooldown: number) {
  return {
    embeds: [
      {
        title: 'Hang Tight! ⏳',
        description: `It looks like you need to wait <t:${cooldown}:R> before you can use that command again. Don\'t worry, we\'ll be ready soon!`,
        color: Colors.Orange
      }
    ]
  }
}
