import { CommandNames } from '@/const/interactionsNames'
import { messagesAboutMe } from '@/messages'
import BuildCommand from '@core/build/BuildCommand'
import { SlashCommandBuilder } from 'discord.js'

const command = new BuildCommand({
  data: new SlashCommandBuilder()
    .setNameLocalizations({
      'es-ES': 'sobre-mi',
      'en-US': 'about-me'
    })
    .setDescription('Get information about me.')
    .setDescriptionLocalizations({
      'es-ES': 'Obtén información sobre mí.',
      'en-US': 'Get information about me.'
    }),
  name: CommandNames.aboutMe,
  scope: 'public',
  ephemeral: true,
  execute: async i => {
    return messagesAboutMe.main(i.locale)
  }
})

export default command
