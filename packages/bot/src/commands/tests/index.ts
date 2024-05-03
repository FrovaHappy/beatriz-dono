import { SlashCommandBuilder } from 'discord.js'
import BuildCommand from '../../shared/BuildCommand'
import { CommandNamesKeys } from '../../const/CommandNames'

export default new BuildCommand({
  cooldown: 60,
  name: CommandNamesKeys.test,
  scope: 'owner',
  permissions: [],
  ephemeral: false,
  data: new SlashCommandBuilder().setDescription('Replies with Pong!'),
  async execute(interaction) {
    return { content: 'test!' }
  }
})
