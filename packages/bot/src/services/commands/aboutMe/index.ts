import { Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import BuildCommand from '@core/build/BuildCommand'
import { getI18n, langs } from '@/i18n'
import { CommandNames } from '@/const/interactionsNames'
import formatterText from '@lib/formatterText'
import links from '@/const/links.json'

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
        new EmbedBuilder({
          title: i18n.response.title,
          color: Colors.Purple,
          description: formatterText(i18n.response.description, {
            slot0: links.docs,
            slot1: links['discord-invite'],
            slot2: links.topgg,
            slot3: links.botlist,
            slot4: links.github
          })
        })
      ]
    }
  }
})

export default command
