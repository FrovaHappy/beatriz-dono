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
    const linkGithubIssues = buttons.get(ButtonNames.linkGithubIssues)
    const linkKofi = buttons.get(ButtonNames.linkKofi)
    const colorDominante = buttons.get(ButtonNames.colorCast)
    const row = new ActionRowBuilder({
      components: [linkDiscord.data, linkGithubIssues.data, linkKofi.data, colorDominante.data]
    })
    return { content: 'test!', components: [row] }
  }
})
