import { Events } from 'discord.js'
import BuildEvent from '@core/build/BuildEvent'
import executeRun from './executeRun'
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
        deferReply: async () => {
          await interaction.deferReply()
        },
        editReply: async options => {
          await interaction.editReply(options)
        }
      })

      return
    }
    if (interaction.isAnySelectMenu()) {
      await executeRun({
        customNameEmitted: interaction.customId,
        type: 'menus',
        locale: interaction.locale,
        interaction,
        deferReply: async () => {
          await interaction.deferReply()
        },
        editReply: async options => {
          await interaction.editReply(options)
        }
      })

      return
    }
    if (interaction.isButton()) {
      await executeRun({
        customNameEmitted: interaction.customId,
        type: 'buttons',
        locale: interaction.locale,
        interaction,
        deferReply: async () => {
          await interaction.deferReply()
        },
        editReply: async options => {
          await interaction.editReply(options)
        }
      })
    }
  }
})
