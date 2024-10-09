import { CommandNames } from '@/const/interactionsNames'
import { getI18n, getI18nCollection } from '@/i18n'
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
  data: new SlashCommandBuilder()
    .setNameLocalizations({
      // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
      ...i18nsArray.reduce((acc, [lang, i18n]) => ({ ...acc, [lang]: i18n.title }), {})
    })
    .setDescription(en.description)
    .setDescriptionLocalizations({
      // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
      ...i18nsArray.reduce((acc, [lang, i18n]) => ({ ...acc, [lang]: i18n.title }), {})
    })
    .addSubcommand(subcommand =>
      subcommand
        .setName('welcome')
        .setDescription(en.options.welcome)
        .setDescriptionLocalizations({
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...i18nsArray.reduce((acc, [lang, i18n]) => ({ ...acc, [lang]: i18n.options.welcome }), {})
        })
    ),
  scope: 'public',
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
