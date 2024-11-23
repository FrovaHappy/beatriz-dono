import { CommandNames } from '@/const/interactionsNames'
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

export default new BuildCommand({
  cooldown: 0,
  name: CommandNames.welcomeSet,
  ephemeral: true,
  scope: 'owner',
  data: new SlashCommandBuilder()
    .setDescription('Set the welcome message')
    .setDescriptionLocalizations({
      'es-ES': 'Establece el mensaje de bienvenida',
      'es-419': 'Establece el mensaje de bienvenida'
    })
    .addChannelOption(op =>
      op.setName('channel').setDescription('channel where the message will be sent').setRequired(true)
    )
    .addStringOption(op =>
      op
        .setName('send')
        .setDescription('send the message with')
        .addChoices(
          { name: 'All', value: SendWelcome.all },
          { name: 'alone message', value: SendWelcome.alone_message },
          { name: 'Alone Image', value: SendWelcome.alone_image },
          { name: 'none', value: SendWelcome.none }
        )
        .setRequired(true)
    )
    .addStringOption(op => op.setName('message').setDescription('message to send').setRequired(false))
    .addStringOption(op => op.setName('image').setDescription('image to send').setRequired(false))
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageMessages
    ),
  async execute(i) {
    const serverId = i.guild?.id
    if (!serverId) return { content: 'error with server id' }
    const imageLength = i.options.getString('image')?.length ?? 0
    const image = stringToJson(i.options.getString('image') ?? '')
    const message = i.options.getString('message') ?? ' welcome to {{server_name}} {{user_name}}'
    const channelId = i.options.getChannel('channel', true).id
    const send = i.options.getString('send', true) as SendWelcome

    const invalidJson = image ? validateCanvas(image) : undefined
    if (invalidJson && imageLength > 0) {
      return {
        embeds: [
          new EmbedBuilder({
            title: 'error in JSON',
            description: `detected an error in the JSON: ${formatZodError(invalidJson)}`,
            color: Colors.Red
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
          title: 'success',
          color: Colors.Aqua,
          description: 'welcome message updated'
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
