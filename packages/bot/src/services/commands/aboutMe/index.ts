import { Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import BuildCommand from '@core/build/BuildCommand'
import { en, es } from '@/i18n'
import { CommandNames } from '@/const/interactionsNames'
import formatterText from '@lib/formatterText'

const command = new BuildCommand({
  data: new SlashCommandBuilder()
    .setDescription(en.aboutMe.buildDescription)
    .setDescriptionLocalization('es-ES', es.aboutMe.buildDescription),
  name: CommandNames.aboutMe,
  scope: 'public',
  ephemeral: true,
  permissions: [],
  execute: async (i, i18n) => {
    return {
      embeds: [
        new EmbedBuilder({
          title: i18n.aboutMe.title,
          color: Colors.Purple,
          description: formatterText(i18n.aboutMe.responseDescription, {
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
