import type { MessageOptions } from '@/types/main'
import formatterText, { type Rules } from '@libs/formatterText'
import { ActionRowBuilder, type ButtonBuilder, type Locale } from 'discord.js'

type componentInfo = { type: 'button' | 'menu' | 'modal'; customId: string }
interface MsgCustom extends Omit<MessageOptions, 'components'> {}

type Messages = Partial<Record<Locale, MsgCustom>> & { default: MsgCustom }

/**
 * Build Messages
 * @param messages is contains all the messages for translation
 * @param defaultMessage is the default message if the locale is not found
 */
class BuildMessages {
  #messages: Messages
  #components: componentInfo[][]
  constructor(props: { translates: Messages; components?: componentInfo[][] }) {
    this.#messages = props.translates
    this.#components = props.components ?? []
  }

  getMessage(locale: Locale, parse: Partial<Rules>): MessageOptions {
    const message = this.#messages[locale] ?? this.#messages.default
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
        return new ActionRowBuilder<ButtonBuilder>().addComponents(
          ...component.map(c => {
            const { type, customId } = c
            if (type === 'button') return buttons.get(customId).getButton(locale)
            if (type === 'menu') return globalThis.menus(customId).get(locale)
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
