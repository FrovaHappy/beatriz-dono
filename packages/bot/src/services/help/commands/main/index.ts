import { CommandNames } from '@/const/interactionsNames'
import { getI18n, getI18nCollection } from '@/i18n'
import BuildCommand from '@core/build/BuildCommand'
import formatterText from '@lib/formatterText'
import { Colors, Locale, SlashCommandBuilder } from 'discord.js'
import welcome from './welcome'

const i18nsArray = getI18nCollection(CommandNames.help)

const en = getI18n(Locale.EnglishUS, CommandNames.help)

export default new BuildCommand({
  name: CommandNames.help,
  cooldown: 5,
  ephemeral: true,
  permissions: [],
  data: new SlashCommandBuilder()
    .setNameLocalizations({
      ...i18nsArray.reduce((acc, [lang, i18n]) => ({ ...acc, [lang]: i18n.title }), {})
    })
    .setDescription(en.description)
    .setDescriptionLocalizations({
      ...i18nsArray.reduce((acc, [lang, i18n]) => ({ ...acc, [lang]: i18n.title }), {})
    })
    .addSubcommand(subcommand =>
      subcommand
        .setName('welcome')
        .setDescription(en.options.welcome)
        .setDescriptionLocalizations({
          ...i18nsArray.reduce((acc, [lang, i18n]) => ({ ...acc, [lang]: i18n.options.welcome }), {})
        })
    ),
  scope: 'public',
  execute: async i => {
    const subcommand = i.options.getSubcommand(true)

    if (subcommand === 'welcome') return welcome(i.locale)
    const i18n = getI18n(i.locale, 'general')
    return {
      embeds: [
        {
          title: formatterText(i18n.errorCommand.title, { slot0: subcommand }),
          description: formatterText(i18n.errorCommand.description, { slot0: subcommand }),
          color: Colors.Orange
        }
      ]
    }
  }
})
