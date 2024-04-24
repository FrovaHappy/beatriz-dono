import { SlashCommandBuilder } from 'discord.js'
import { CommandsNames } from '../../enums'
import { BuildCommand } from '../../buildersSchema'
const name = CommandsNames.test
export default BuildCommand({
  cooldown: 60,
  name,
  scope: 'owner',
  data: new SlashCommandBuilder().setName(name).setDescription('Replies with Pong!'),
  async execute(interaction) {
    return { content: 'test!' }
  }
})
