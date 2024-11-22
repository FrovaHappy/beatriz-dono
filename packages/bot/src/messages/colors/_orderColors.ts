import { ButtonNames } from '@/const/interactionsNames'
import { ActionRowBuilder, Colors, type Locale } from 'discord.js'

export default function orderColors(locale: Locale) {
  return {
    embeds: [
      {
        title: '✅ Colors Reordenados',
        description: 'Los colores han sido reordenados. Ya puedes hacer otras cosas.',
        color: Colors.Green,
        footer: {
          text: 'mensaje no traducido'
        }
      }
    ],
    components: [new ActionRowBuilder().addComponents(buttons.get(ButtonNames.setting).data)]
  }
}