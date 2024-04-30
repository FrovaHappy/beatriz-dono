import { SlashCommandBuilder } from 'discord.js'
import { CommandsNames } from '../../enums'
import BuildCommand from '../../shared/BuildCommand'
const name = CommandsNames.test
export default new BuildCommand({
  cooldown: 60,
  name,
  scope: 'owner',
  permissions: [],
  ephemeral: false,
  data: new SlashCommandBuilder().setName(name).setDescription('Replies with Pong!'),
  async execute(interaction) {
    return { content: 'test!' }
  }
})
