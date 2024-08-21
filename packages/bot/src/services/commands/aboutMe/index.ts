import { Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import BuildCommand from '@core/build/BuildCommand'
import { getI18n, langs } from '@/i18n'
import { CommandNames } from '@/const/interactionsNames'
import formatterText from '@lib/formatterText'

const i18nsArray = langs(CommandNames.aboutMe)
const en = i18nsArray[0][1]

const command = new BuildCommand({
  data: new SlashCommandBuilder().setDescription(en.description).setDescriptionLocalizations({
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
            slot0: 'https://frovahappy.gitbook.io/beatriz-bot-docs/',
            slot1: 'https://discord.app/',
            slot2: 'https://top.gg/bot/971562890702237766',
            slot3: 'https://discordbotlist.com/bots/beatrizdono-beta',
            slot4: 'https://github.com/FrovaHappy/beatriz-bot'
          })
        })
      ]
    }
  }
})

export default command
