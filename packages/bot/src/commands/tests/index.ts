import { ActionRowBuilder, SlashCommandBuilder, type StringSelectMenuBuilder } from 'discord.js'
import BuildCommand from '@core/build/BuildCommand'
import { CommandNamesKeys } from '../../const/CommandNames'
import { MENU_NAME } from '@/const/MenuMames'
import { type Menu } from '@/core/build/BuildMenu'

export default new BuildCommand({
  cooldown: 60,
  name: CommandNamesKeys.test,
  scope: 'owner',
  permissions: [],
  ephemeral: false,
  data: new SlashCommandBuilder().setDescription('Replies with Pong!'),
  async execute(interaction, i18n) {
    const select: Menu = globalThis.menus.get(MENU_NAME.test)
    console.log(select)
    const row = new ActionRowBuilder<StringSelectMenuBuilder>({ components: [select.data] })
    return { content: 'test!', components: [row] }
  }
})
