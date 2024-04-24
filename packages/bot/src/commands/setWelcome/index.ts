import { type GuildMember, SlashCommandBuilder, EmbedBuilder, Colors, PermissionFlagsBits } from 'discord.js'
import { CommandsNames } from '../../enums'
import { BuildCommand } from '../../buildersSchema'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { validateCanvas } from './validate'
import { formatZodError } from '../../shared/validate'
import { SendWelcome } from '@prisma/client'
import messageFormatting, { userSecuencies } from '../../shared/messageFormatting'
import db from '../../db'
import { stringToJson } from '../../shared/general'
import SendWelcomeWith from '../../shared/sendWelcomeWith'
import getI18n, { es, en } from '../../shared/i18n'

const name = CommandsNames.setWelcome
export default BuildCommand({
  cooldown: 0,
  name,
  ephemeral: true,
  scope: 'public',
  data: new SlashCommandBuilder()
    .setName(name)
    .setDescription(en.setWelcome.build.mainDescription)
    .setDescriptionLocalization('es-ES', es.setWelcome.build.mainDescription)
    .addChannelOption(op =>
      op
        .setName('channel')
        .setDescription(en.setWelcome.build.channelDescription)
        .setDescriptionLocalization('es-ES', es.setWelcome.build.channelDescription)
        .setRequired(true)
    )
    .addStringOption(op =>
      op
        .setName('send')
        .setDescription(en.setWelcome.build.sendDescription)
        .setDescriptionLocalization('es-ES', es.setWelcome.build.sendDescription)
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
        .setDescription(en.setWelcome.build.messageDescription)
        .setDescriptionLocalization('es-ES', es.setWelcome.build.messageDescription)
        .setRequired(false)
    )
    .addStringOption(op =>
      op
        .setName('image')
        .setDescription(en.setWelcome.build.imageDescription)
        .setDescriptionLocalization('es-ES', es.setWelcome.build.imageDescription)
        .setRequired(false)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageMessages
    ),
  async execute(i) {
    const i18n = getI18n(i.locale)
    const serverId = i.guild?.id
    if (!serverId) return { content: 'error with server id' }
    const imageLength = i.options.getString('image')?.length ?? 0
    const image = stringToJson(i.options.getString('image') ?? '')
    const imageMock = stringToJson(readFileSync(path.join(__dirname, '../../../mocks/welcome.json'), 'utf-8'))
    const message = i.options.getString('message') ?? i18n.setWelcome.messageDefault
    const channelId = i.options.getChannel('channel', true).id
    const send = i.options.getString('send', true) as SendWelcome

    const invalidJson = image ? validateCanvas(image) : undefined
    if (invalidJson ?? imageLength > 0) {
      return {
        embeds: [
          new EmbedBuilder({
            title: i18n.setWelcome.errorValidation.title,
            description: `${i18n.setWelcome.errorValidation.description}\n${formatZodError(invalidJson)}`
          })
        ]
      }
    }
    const messageReply = userSecuencies(message, i.member as GuildMember)
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
          title: i18n.setWelcome.response.title,
          color: Colors.Aqua,
          description: messageFormatting(i18n.setWelcome.response.description, {
            slot0: channelId,
            slot1: send
          })
        })
      ],
      ...(await SendWelcomeWith({
        image: image ?? imageMock,
        message: messageReply,
        member: i.member as GuildMember,
        send
      }))
    }
  }
})
