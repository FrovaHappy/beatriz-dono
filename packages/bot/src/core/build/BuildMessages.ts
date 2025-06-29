import type { MessageOptions } from '@/types/main'
import formatterText, { type Rules } from '@libs/formatterText'
import { ActionRowBuilder, type Locale } from 'discord.js'

type componentInfo = { type: 'button' | 'menu' | 'modal'; customId: string }
interface MsgCustom extends Omit<MessageOptions, 'components'> {}

type Messages = Partial<Record<Locale, MsgCustom>> & { default: MsgCustom }

type IdString = `${'global' | 'service' | 'event'}-${string}`

interface MessagesConstructor {
  customId: IdString
  translates: Messages
  components?: componentInfo[][]
}

/**
 * Build Messages
 * @param translates Messages to be translated, default property is required
 * @param components Components to be added to the message
 */
class BuildMessages {
  customId: string
  #messages: Messages
  #components: componentInfo[][]
  constructor(props: MessagesConstructor) {
    this.customId = this.#parseId(props.customId)
    this.#messages = props.translates
    this.#components = props.components ?? []
  }

  #parseId(id: string) {
    const reg = /^(global|service|event)-([a-zA-Z]+)$/
    const match = id.match(reg)
    if (!match) throw new Error('Invalid ID, must be in the format: global-<name>, service-<name>, event-<name>')
    return id
  }

  getMessage(locale: Locale, parse: Partial<Rules>): MessageOptions {
    const message = this.#messages?.[locale] ?? this.#messages.default
    const format = (prop: any): any => {
      if (typeof prop === 'string') return formatterText(prop, parse)
      if (typeof prop === 'number') return prop
      if (typeof prop === 'boolean') return prop
      if (prop === null || prop === undefined) return prop
      if (Array.isArray(prop)) return prop.map(format(prop))
      if (typeof prop === 'object') {
        const keys = Object.keys(prop)
        if (keys.length === 0) return prop
        return keys.reduce((acc, key) => {
          acc[key] = format(prop[key])
          return acc
        }, {} as any)
      }
    }
    const buildComponents = () => {
      return this.#components.map(component => {
        return new ActionRowBuilder<any>().addComponents(
          ...component.map(c => {
            const { type, customId } = c
            if (type === 'button') return globalThis?.buttons(customId).get(locale)
            if (type === 'menu') return globalThis?.menus(customId).get(locale)
            if (type === 'modal') return globalThis?.buttons(`modal-${customId}`).get(locale)
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
