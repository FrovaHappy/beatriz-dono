import type { InteractionEditReplyOptions, MessagePayload } from 'discord.js'
import type { CustomButtonInteraction, CustomCommandInteraction } from './InteractionsCreate'
export type EditReplyConstructor = InteractionEditReplyOptions | MessagePayload
interface InteractionProperty {
  interaction: CustomCommandInteraction | CustomButtonInteraction
}

export type EditReplyConstructorFn<T = object> = (key: T & InteractionProperty) => EditReplyConstructor | object
