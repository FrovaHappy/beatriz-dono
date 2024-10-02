import { CommandNames } from '@/const/interactionsNames'
import { getI18n, getI18nCollection } from '@/i18n'
import BuildCommand from '@core/build/BuildCommand'
import formatterText from '@lib/formatterText'
import { Locale, SlashCommandBuilder, resolveColor } from 'discord.js'

const en = getI18n(Locale.EnglishUS, CommandNames.aboutMe)
const i18nsArray = getI18nCollection(CommandNames.aboutMe)

const command = new BuildCommand({
  data: new SlashCommandBuilder()
    .setNameLocalizations({ ...i18nsArray.reduce((acc, [l, i18n]) => ({ ...acc, [l]: i18n.name }), {}) })
    .setDescription(en.description)
    .setDescriptionLocalizations({
      ...i18nsArray.reduce((acc, [l, i18n]) => ({ ...acc, [l]: i18n.description }), {})
    }),
  name: CommandNames.aboutMe,
  scope: 'public',
  ephemeral: true,
  permissions: [],
  execute: async i => {
    const i18n = getI18n(i.locale, CommandNames.aboutMe)
    return {
      embeds: [
        {
          title: i18n.response.title,
          color: resolveColor('#e6a7a7'),
          description: formatterText(i18n.response.description, {
            userName: i.user.username,
            slot0: config.linkDiscord,
            slot1: config.linkTopgg,
            slot2: config.linkBotList,
            slot3: config.linkGithub
          })
        }
      ]
    }
  }
})

export default command
