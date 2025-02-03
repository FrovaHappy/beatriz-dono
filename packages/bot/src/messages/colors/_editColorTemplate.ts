import { ButtonNames } from '@/const/interactionsNames'
import type { MessageOptions } from '@/types/main'
import { ActionRowBuilder, Colors, type Locale } from 'discord.js'

function jsonInvalid(locale: Locale, error: { title: string; description: string }): MessageOptions {
  const { title, description } = error
  return {
    embeds: [
      {
        title,
        description,
        color: Colors.Red
      }
    ]
  }
}

function success(locale: Locale): MessageOptions {
  return {
    embeds: [
      {
        title: 'Color Template Editado',
        description: 'Color Template Editado',
        color: Colors.Green
      }
    ],
    components: [new ActionRowBuilder().addComponents(buttons.get(ButtonNames.setting).data)]
  }
}

export default {
  jsonInvalid,
  success
}
