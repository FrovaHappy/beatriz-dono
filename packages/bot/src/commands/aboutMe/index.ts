import { Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import BuildCommand from '../../shared/BuildCommand'
import messageFormatting from '../../shared/messageFormatting'
import { getSetting } from '../../setting'
import getI18n, { en, es } from '../../i18n'
import { CommandNamesKeys } from '../../const/CommandNames'

const command = new BuildCommand({
  data: new SlashCommandBuilder()
    .setDescription(en.aboutMe.buildDescription)
    .setDescriptionLocalization('es-ES', es.aboutMe.buildDescription),
  name: CommandNamesKeys.aboutMe,
  scope: 'public',
  ephemeral: true,
  permissions: [],
  execute: async i => {
    const setting = getSetting()
    const i18n = getI18n(i.locale)
    return {
      embeds: [
        new EmbedBuilder({
          title: i18n.aboutMe.title,
          color: Colors.Purple,
          description: messageFormatting(i18n.aboutMe.responseDescription, {
            slot0: 'https://frovahappy.gitbook.io/beatriz-bot-docs/',
            slot1: setting.discordInviteUrl,
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
