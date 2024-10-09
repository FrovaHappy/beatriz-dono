import { CommandNames } from '@/const/interactionsNames'
import { getI18n, getI18nCollection } from '@/i18n'
import { reduceTupleToObj } from '@/shared/general'
import BuildCommand from '@core/build/BuildCommand'
import formatterText from '@libs/formatterText'
import { Locale, SlashCommandBuilder, resolveColor } from 'discord.js'

const en = getI18n(Locale.EnglishUS, CommandNames.aboutMe)
const i18nsArray = getI18nCollection(CommandNames.aboutMe)

const command = new BuildCommand({
  data: new SlashCommandBuilder()
    .setNameLocalizations(reduceTupleToObj(i18nsArray, 'name'))
    .setDescription(en.description)
    .setDescriptionLocalizations(reduceTupleToObj(i18nsArray, 'description')),
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
