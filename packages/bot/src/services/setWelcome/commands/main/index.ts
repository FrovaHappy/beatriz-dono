import { CommandNames } from '@/const/interactionsNames'
import { getI18n, getI18nCollection } from '@/i18n'
import { reduceTupleToObj, stringToJson } from '@/shared/general'
import SendWelcomeWith from '@/shared/sendWelcomeWith'
import { formatZodError } from '@/shared/validate'
import BuildCommand from '@core/build/BuildCommand'
import db from '@core/db'
import formatterText from '@libs/formatterText'
import WELCOME from '@libs/welcome'
import { SendWelcome } from '@prisma/client'
import { Colors, EmbedBuilder, type GuildMember, Locale, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { validateCanvas } from './validate'

const i18nsArray = getI18nCollection(CommandNames.welcomeSet)
const en = getI18n(Locale.EnglishUS, CommandNames.welcomeSet)

export default new BuildCommand({
  cooldown: 0,
  name: CommandNames.welcomeSet,
  ephemeral: true,
  scope: 'owner',
  permissions: [],
  data: new SlashCommandBuilder()
    .setDescription(en.description)
    .setDescriptionLocalizations(reduceTupleToObj(i18nsArray, 'description'))
    .addChannelOption(op =>
      op
        .setName('channel')
        .setDescription(en.options.channel)
        .setDescriptionLocalizations(reduceTupleToObj(i18nsArray, 'options.channel'))
        .setRequired(true)
    )
    .addStringOption(op =>
      op
        .setName('send')
        .setDescription(en.options.send)
        .setDescriptionLocalizations(reduceTupleToObj(i18nsArray, 'options.send'))
        .addChoices(
          { name: 'All', value: SendWelcome.all },
          { name: 'alone message', value: SendWelcome.alone_message },
          { name: 'Alone Image', value: SendWelcome.alone_image },
          { name: 'none', value: SendWelcome.none }
        )
        .setRequired(true)
    )
    .addStringOption(op =>
      op
        .setName('message')
        .setDescription(en.options.message)
        .setDescriptionLocalizations(reduceTupleToObj(i18nsArray, 'options.message'))
        .setRequired(false)
    )
    .addStringOption(op =>
      op
        .setName('image')
        .setDescription(en.options.image)
        .setDescriptionLocalizations(reduceTupleToObj(i18nsArray, 'options.image'))
        .setRequired(false)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageMessages
    ),
  async execute(i) {
    const i18n = getI18n(i.locale, CommandNames.welcomeSet)
    const serverId = i.guild?.id
    if (!serverId) return { content: 'error with server id' }
    const imageLength = i.options.getString('image')?.length ?? 0
    const image = stringToJson(i.options.getString('image') ?? '')
    const message = i.options.getString('message') ?? i18n.messageDefault
    const channelId = i.options.getChannel('channel', true).id
    const send = i.options.getString('send', true) as SendWelcome

    const invalidJson = image ? validateCanvas(image) : undefined
    if (invalidJson && imageLength > 0) {
      return {
        embeds: [
          new EmbedBuilder({
            title: i18n.errorValidation.title,
            description: `${i18n.errorValidation.description}\n${formatZodError(invalidJson)}`
          })
        ]
      }
    }
    const messageReply = formatterText(message, {
      '{{server_count}}': i.guild?.memberCount.toString(),
      '{{server_name}}': i.guild?.name,
      '{{user_name}}': i.member?.user.username,
      '{{user_id}}': i.member?.user.id,
      '{{user_discriminator}}': i.member?.user.discriminator
    })
    await db.server.update({
      where: { serverId },
      data: {
        welcome: {
          upsert: { create: { channelId, message, send, image }, update: { channelId, message, send, image } }
        }
      }
    })
    return {
      embeds: [
        new EmbedBuilder({
          title: i18n.response.title,
          color: Colors.Aqua,
          description: formatterText(i18n.response.description, {
            '{{slot0}}': channelId,
            '{{slot1}}': send
          })
        })
      ],
      ...(await SendWelcomeWith({
        image: image ?? WELCOME,
        message: messageReply,
        member: i.member as GuildMember,
        send
      }))
    }
  }
})
