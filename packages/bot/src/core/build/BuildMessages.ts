import type { MessageOptions } from '@/types/main'
import formatterText, { type Rules } from '@libs/formatterText'
import { ActionRowBuilder, type ButtonBuilder, type Locale } from 'discord.js'

type componentInfo = { type: 'button' | 'menu' | 'modal'; customId: string }
interface MsgCustom extends Omit<MessageOptions, 'components'> {
  components?: componentInfo[][]
}

type Messages = Partial<Record<Locale, MsgCustom>> & { default: MsgCustom }

/**
 * Build Messages
 * @param messages is contains all the messages for translation
 * @param defaultMessage is the default message if the locale is not found
 */
class BuildMessages {
  #messages: Messages
  constructor(messages: Messages) {
    this.#messages = messages
  }

  getMessage(locale: Locale, parse: Partial<Rules>): MessageOptions {
    const message = this.#messages[locale] ?? this.#messages.default
    const format = (prop: any) => {
      if (typeof prop === 'undefined') return
      let text = JSON.stringify(prop)
      text = formatterText(text, parse)
      return JSON.parse(text)
    }
    const buildComponents = () => {
      if (!message.components) return []
      return message.components.map(component => {
        return new ActionRowBuilder<ButtonBuilder>().addComponents(
          ...component.map(c => {
            const { type, customId } = c
            if (type === 'button') return buttons.get(customId).getButton(locale)
            if (type === 'menu') return menus.get(customId).get(locale)
            // if (type === 'modal') return modals.get(customId).getModal(locale)
          })
        )
      })
    }
    return {
      content: format(message.content),
      embeds: message.embeds?.map((embed: any) => format(embed)),
      components: buildComponents(),
      files: message.files
    }
  }
}

export default BuildMessages
