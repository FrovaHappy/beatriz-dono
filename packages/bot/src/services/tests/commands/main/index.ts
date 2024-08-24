import { ActionRowBuilder, SlashCommandBuilder, type StringSelectMenuBuilder } from 'discord.js'
import BuildCommand from '@core/build/BuildCommand'
import { type Menu } from '@/core/build/BuildMenu'
import { CommandNames, MenuNames } from '@/const/interactionsNames'

export default new BuildCommand({
  cooldown: 60,
  name: CommandNames.test,
  scope: 'owner',
  permissions: [],
  ephemeral: true,
  data: new SlashCommandBuilder().setDescription('Replies with Pong!'),
  async execute() {
    const select: Menu = globalThis.menus.get(MenuNames.test)
    console.log(select)
    const row = new ActionRowBuilder<StringSelectMenuBuilder>({ components: [select.data] })
    return { content: 'test!', components: [row] }
  }
})
