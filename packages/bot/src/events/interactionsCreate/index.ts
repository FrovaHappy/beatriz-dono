import { Events } from 'discord.js'
import executeCommand from './executeCommand'
import executeButton from './executeButton'
import BuildEvent from '@core/build/BuildEvent'
export default new BuildEvent({
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      await executeCommand(interaction)
      return
    }
    if (interaction.isButton()) {
      await executeButton(interaction)
    }
  }
})
