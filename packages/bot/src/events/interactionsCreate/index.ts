import { Events } from 'discord.js'
import BuildEvent from '@core/build/BuildEvent'
import executeRun from './executeRun'
import BuildModal from '@/core/build/BuildModal'
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
      await executeRun({
        customNameEmitted: interaction.customId,
        type: 'menus',
        locale: interaction.locale,
        interaction,
        deferReply: async options => {},
        editReply: async options => {
          await interaction.update(options)
        },
        reply: async options => {
          const { ephemeral, flags, ...op } = options
          await interaction.update(op)
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
    }
    if (interaction.isModalSubmit()) {
      await BuildModal.runInteraction(interaction)
    }
  }
})
