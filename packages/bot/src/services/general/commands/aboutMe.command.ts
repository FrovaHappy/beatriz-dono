import { CommandNames } from '@/const/interactionsNames'
import { messagesAboutMe } from '@/messages'
import { reduceTupleToObj, type TupleKeyObject } from '@/shared/general'
import BuildCommand from '@core/build/BuildCommand'
import { Locale, SlashCommandBuilder } from 'discord.js'

const i18nsArray: TupleKeyObject[] = [
  [
    Locale.EnglishUS,
    {
      name: 'about-me',
      description: 'Get information about me.'
    }
  ],
  [
    Locale.SpanishES,
    {
      name: 'sobre-mi',
      description: 'Obtén información sobre mí.'
    }
  ]
]

const command = new BuildCommand({
  data: new SlashCommandBuilder()
    .setNameLocalizations(reduceTupleToObj(i18nsArray, 'name'))
    .setDescription(i18nsArray[0][1].description)
    .setDescriptionLocalizations(reduceTupleToObj(i18nsArray, 'description')),
  name: CommandNames.aboutMe,
  scope: 'public',
  ephemeral: true,
  permissions: [],
  execute: async i => {
    return messagesAboutMe.main(i.locale)
  }
})

export default command
