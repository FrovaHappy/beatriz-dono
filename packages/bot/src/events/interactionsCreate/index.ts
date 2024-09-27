import BuildButton from '@/core/build/BuildButtons'
import BuildCommand from '@/core/build/BuildCommand'
import BuildMenu from '@/core/build/BuildMenu'
import BuildModal from '@/core/build/BuildModal'
import BuildEvent from '@core/build/BuildEvent'
import { Events } from 'discord.js'
export default new BuildEvent({
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      await BuildCommand.runInteraction(interaction)
    }
    if (interaction.isAnySelectMenu()) {
      await BuildMenu.runInteraction(interaction)
    }
    if (interaction.isButton()) {
      await BuildButton.runInteraction(interaction)
    }
    if (interaction.isModalSubmit()) {
      await BuildModal.runInteraction(interaction)
    }
  }
})
