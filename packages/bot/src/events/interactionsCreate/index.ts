import { Events } from 'discord.js'
import BuildEvent from '@core/build/BuildEvent'
import executeRun from './executeRun'
import BuildModal from '@/core/build/BuildModal'
import BuildButton from '@/core/build/BuildButtons'
import BuildMenu from '@/core/build/BuildMenu'
export default new BuildEvent({
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      await executeRun({
        customNameEmitted: interaction.commandName,
        type: 'commands',
        locale: interaction.locale,
        interaction,
        deferReply: async options => {
          await interaction.deferReply(options)
        },
        editReply: async options => {
          await interaction.editReply(options)
        },
        reply: async options => {
          await interaction.reply(options)
        }
      })

      return
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
