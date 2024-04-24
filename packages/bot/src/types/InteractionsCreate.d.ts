import type { BaseInteraction, ButtonInteraction, ChatInputCommandInteraction } from 'discord.js'
import type { ClientCustom } from './main'

export interface CustomBaseInteraction extends BaseInteraction {
  client: ClientCustom
}
export interface CustomButtonInteraction extends ButtonInteraction {
  client: ClientCustom
}
export interface CustomCommandInteraction extends ChatInputCommandInteraction {
  client: ClientCustom
}
