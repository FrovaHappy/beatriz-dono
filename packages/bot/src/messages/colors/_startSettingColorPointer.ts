import { ButtonNames } from '@/const/interactionsNames'
import type { MessageOptions } from '@/types/main'
import { ActionRowBuilder, Colors, type Locale } from 'discord.js'

function errorCreatingRole(locale: Locale): MessageOptions {
  return {
    embeds: [
      {
        title: '⛔ Oops! Could not create role!',
        description:
          'something went wrong with the color pointer. Please contact the administrator or report the error.',
        color: Colors.Red
      }
    ],
    components: [
      new ActionRowBuilder().addComponents(
        buttons.get(ButtonNames.linkDiscord).data,
        buttons.get(ButtonNames.linkGithubIssues).data
      )
    ]
  }
}

function success(locale: Locale) {
  return {
    embeds: [
      {
        title: '✅ Color Module Activated!',
        description:
          'el rol ya fue creado, ahora puedes mover el rol manualmente en la configuración del servidor\n\n** Para reordenar los colores, haz click en el botón de abajo **',
        color: Colors.Green
      }
    ],
    components: [new ActionRowBuilder().addComponents(buttons.get(ButtonNames.serverColorOrder).data)]
  }
}

export default {
  errorCreatingRole,
  success
}