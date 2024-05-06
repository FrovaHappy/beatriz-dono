import BuildCommand from '@core/build/BuildCommand'
import { Colors, SlashCommandBuilder } from 'discord.js'
import { en, es } from '../../i18n'
import messageFormatting from '../../shared/messageFormatting'
import welcome from './welcome'
import { CommandNames } from '@/const/interactionsNames'

export default new BuildCommand({
  name: CommandNames.help,
  cooldown: 5,
  ephemeral: true,
  permissions: [],
  data: new SlashCommandBuilder()
    .setDescription(en.help.generalDescription)
    .setDescriptionLocalization('es-ES', es.help.generalDescription)
    .addSubcommand(subcommand =>
      subcommand
        .setName('welcome')
        .setDescription(en.help.welcomeDescription)
        .setDescriptionLocalization('es-ES', es.help.welcomeDescription)
    ),
  scope: 'public',
  execute: async (i, i18n) => {
    const subcommand = i.options.getSubcommand(true)

    if (subcommand === 'welcome') return welcome(i18n)

    return {
      embeds: [
        {
          title: messageFormatting(i18n.errorCommand.title, { slot0: subcommand }),
          description: messageFormatting(i18n.errorCommand.description, { slot0: subcommand }),
          color: Colors.Orange
        }
      ]
    }
  }
})
