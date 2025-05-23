import BuildCommand from '@core/build/BuildCommand'
import { SlashCommandBuilder } from 'discord.js'
import msgAboutMe from './msg.aboutMe'

const command = new BuildCommand({
  scope: 'free',
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
  name: 'aboutme',
  ephemeral: true,
  execute: async i => {
    return msgAboutMe.getMessage(i.locale, {})
  }
})

export default command
