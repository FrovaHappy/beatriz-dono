import BuildCommand from '../../shared/BuildCommand'
import { CommandsNames } from '../../enums'
import { Colors, SlashCommandBuilder } from 'discord.js'
import getI18n, { en, es } from '../../shared/i18n'
import messageFormatting from '../../shared/messageFormatting'
import welcome from './welcome'
const name = CommandsNames.help
export default new BuildCommand({
  name,
  cooldown: 5,
  ephemeral: true,
  permissions: [],
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription(en.help.generalDescription)
    .setDescriptionLocalization('es-ES', es.help.generalDescription)
    .addSubcommand(subcommand =>
      subcommand
        .setName('welcome')
        .setDescription(en.help.welcomeDescription)
        .setDescriptionLocalization('es-ES', es.help.welcomeDescription)
    ),
  scope: 'public',
  execute: async i => {
    const subcommand = i.options.getSubcommand(true)
    const i18n = getI18n(i.locale)

    if (subcommand === 'welcome') return welcome(i)

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
