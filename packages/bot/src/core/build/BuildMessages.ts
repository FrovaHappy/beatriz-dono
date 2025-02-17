import type { MessageOptions } from '@/types/main'
import formatterText, { type Rules } from '@libs/formatterText'
import type { Locale } from 'discord.js'

type Messages = Partial<Record<Locale, MessageOptions>>
interface PropsBuildMessages extends Messages {
  default: MessageOptions
}
/**
 * Build Messages
 * @param messages is contains all the messages for translation
 * @param defaultMessage is the default message if the locale is not found
 */
class BuildMessages {
  #messages: Messages
  #defaultMessage: MessageOptions
  constructor(props: PropsBuildMessages) {
    const { default: defaultMessage, ...messages } = props
    this.#messages = messages
    this.#defaultMessage = defaultMessage
  }

  getMessage(locale: Locale, parse: Partial<Rules>): MessageOptions {
    const message = this.#messages[locale] ?? this.#defaultMessage
    const format = (prop: any) => {
      if (typeof prop === 'undefined') return
      let text = JSON.stringify(prop)
      text = formatterText(text, parse)
      return JSON.parse(text)
    }
    return {
      content: format(message.content),
      embeds: message.embeds?.map((embed: any) => format(embed)),
      components: message.components?.map((component: any) => format(component)),
      files: message.files
    }
  }
}

export default BuildMessages
