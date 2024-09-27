import { CommandNames } from '@/const/interactionsNames'
import links from '@/const/links.json'
import { getI18n, langs } from '@/i18n'
import BuildCommand from '@core/build/BuildCommand'
import formatterText from '@lib/formatterText'
import { SlashCommandBuilder, resolveColor } from 'discord.js'

const i18nsArray = langs(CommandNames.aboutMe)
const en = i18nsArray[0][1]

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
            slot0: links['discord-invite'],
            slot1: links.topgg,
            slot2: links.botlist,
            slot3: links.github
          })
        }
      ]
    }
  }
})

export default command
