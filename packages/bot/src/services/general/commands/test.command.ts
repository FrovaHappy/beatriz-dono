import type { Menu } from '@/core/build/BuildMenu'
import BuildCommand from '@core/build/BuildCommand'
import { ActionRowBuilder, SlashCommandBuilder, type StringSelectMenuBuilder } from 'discord.js'

export default new BuildCommand({
  cooldown: 60,
  name: 'test',
  scope: 'private',
  ephemeral: true,
  data: new SlashCommandBuilder().setDescription('Replies with Pong!'),
  async execute() {
    return { content: 'test!' }
  }
})
