import { CommandNames } from '@/const/interactionsNames'
import { getI18n, langs } from '@/i18n'
import { formatterUser } from '@/services/shared/formatterUser'
import { stringToJson } from '@/shared/general'
import SendWelcomeWith from '@/shared/sendWelcomeWith'
import { formatZodError } from '@/shared/validate'
import BuildCommand from '@core/build/BuildCommand'
import db from '@core/db'
import formatterText from '@lib/formatterText'
import WELCOME from '@lib/welcome'
import { SendWelcome } from '@prisma/client'
import { Colors, EmbedBuilder, type GuildMember, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import { validateCanvas } from './validate'

const i18nsArray = langs(CommandNames.welcomeSet)
const en = i18nsArray[0][1]

export default new BuildCommand({
  cooldown: 0,
  name: CommandNames.welcomeSet,
  ephemeral: true,
  scope: 'public',
  permissions: [],
  data: new SlashCommandBuilder()
    .setDescription(en.description)
    .setDescriptionLocalizations({
      ...i18nsArray.reduce((acc, [l, i18n]) => ({ ...acc, [l]: i18n.description }), {})
    })
    .addChannelOption(op =>
      op
        .setName('channel')
        .setDescription(en.options.channel)
        .setDescriptionLocalizations({
          ...i18nsArray.reduce((acc, [l, i18n]) => ({ ...acc, [l]: i18n.options.channel }), {})
        })
        .setRequired(true)
    )
    .addStringOption(op =>
      op
        .setName('send')
        .setDescription(en.options.send)
        .setDescriptionLocalizations({
          ...i18nsArray.reduce((acc, [l, i18n]) => ({ ...acc, [l]: i18n.options.send }), {})
        })
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
        .setDescriptionLocalizations({
          ...i18nsArray.reduce((acc, [l, i18n]) => ({ ...acc, [l]: i18n.options.message }), {})
        })
        .setRequired(false)
    )
    .addStringOption(op =>
      op
        .setName('image')
        .setDescription(en.options.image)
        .setDescriptionLocalizations({
          ...i18nsArray.reduce((acc, [l, i18n]) => ({ ...acc, [l]: i18n.options.image }), {})
        })
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
    const messageReply = formatterUser(message, i.user, i.guild.memberCount)
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
            slot0: channelId,
            slot1: send
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
