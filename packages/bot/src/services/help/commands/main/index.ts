import { CommandNames } from '@/const/interactionsNames'
import { getI18n, getI18nCollection } from '@/i18n'
import { reduceTupleToObj } from '@/shared/general'
import BuildCommand from '@core/build/BuildCommand'
import formatterText from '@libs/formatterText'
import { Colors, Locale, SlashCommandBuilder } from 'discord.js'

const i18nsArray = getI18nCollection(CommandNames.help)

const en = getI18n(Locale.EnglishUS, CommandNames.help)

export default new BuildCommand({
  name: CommandNames.help,
  cooldown: 5,
  ephemeral: true,
  permissions: [],
  scope: 'public',
  data: new SlashCommandBuilder()
    .setNameLocalizations(reduceTupleToObj(i18nsArray, 'title'))
    .setDescription(en.description)
    .setDescriptionLocalizations(reduceTupleToObj(i18nsArray, 'description'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('welcome')
        .setDescription(en.options.welcome)
        .setDescriptionLocalizations(reduceTupleToObj(i18nsArray, 'options.welcome'))
    ),
  execute: async i => {
    const subcommand = i.options.getSubcommand(true)
    const i18n = getI18n(i.locale, CommandNames.help)
    const i18nGlobal = getI18n(i.locale, 'general')

    if (subcommand === 'welcome') {
      return {
        embeds: [
          {
            title: i18n.welcomeEmbed.title,
            description: formatterText(i18n.welcomeEmbed.description, {
              slot0: config.linkDocumentation,
              slot1: config.linkWebsite
            }),
            color: 561481
          }
        ]
      }
    }
    return {
      embeds: [
        {
          title: formatterText(i18nGlobal.errorCommand.title, { slot0: subcommand }),
          description: formatterText(i18nGlobal.errorCommand.description, { slot0: subcommand }),
          color: Colors.Orange
        }
      ]
    }
  }
})
