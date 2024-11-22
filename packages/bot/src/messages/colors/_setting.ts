import { ButtonNames, MenuNames } from '@/const/interactionsNames'
import type { MessageOptions } from '@/types/main'
import { ActionRowBuilder, Colors, type Locale } from 'discord.js'

export default function setting(locale: Locale): MessageOptions {
  return {
    embeds: [
      {
        title: 'Configuración',
        description: 'Configuración de los colores del servidor',
        color: Colors.Green
      }
    ],
    components: [
      new ActionRowBuilder().addComponents(menus.get(MenuNames.settingColorRemove).data),
      new ActionRowBuilder().addComponents(
        buttons.get(ButtonNames.editColorDefault).data,
        buttons.get(ButtonNames.serverColorOrder).data
      )
    ]
  }
}
