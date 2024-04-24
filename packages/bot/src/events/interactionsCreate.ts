import { Events } from 'discord.js'
import executeCommand from './interactionsCreate/executeCommand'
import executeButton from './interactionsCreate/executeButton'
import type { CustomBaseInteraction } from '../types/InteractionsCreate'
export default {
  name: Events.InteractionCreate,
  async execute(interaction: CustomBaseInteraction) {
    if (interaction.isChatInputCommand()) {
      await executeCommand(interaction)
      return
    }
    if (interaction.isButton()) {
      await executeButton(interaction)
    }
  }
}
