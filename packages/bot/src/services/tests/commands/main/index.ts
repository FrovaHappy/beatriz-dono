import { ButtonNames, CommandNames, MenuNames } from '@/const/interactionsNames'
import type { Menu } from '@/core/build/BuildMenu'
import BuildCommand from '@core/build/BuildCommand'
import { ActionRowBuilder, SlashCommandBuilder, type StringSelectMenuBuilder } from 'discord.js'

export default new BuildCommand({
  cooldown: 60,
  name: CommandNames.test,
  scope: 'private',
  permissions: [],
  ephemeral: true,
  data: new SlashCommandBuilder().setDescription('Replies with Pong!'),
  async execute() {
    const linkDiscord = buttons.get(ButtonNames.linkDiscord)
    const row = new ActionRowBuilder({ components: [linkDiscord.data] })
    return { content: 'test!', components: [row] }
  }
})
