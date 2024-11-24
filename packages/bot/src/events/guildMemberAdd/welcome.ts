import SendWelcomeWith from '@/shared/sendWelcomeWith'
import type { Canvas } from '@/types/Canvas.types'
import db from '@core/db'
import WELCOME from '@libs/welcome'
import { Emoji, type GuildMember } from 'discord.js'
import { validateCanvas } from '../../services/setWelcome/commands/main/validate'
import formatterText from '@libs/formatterText'
import emojis, { getEmoji } from '@/const/emojis'
export default async function welcome(member: GuildMember): Promise<void> {
  const welcomeDb = await db.welcomeCommand.findUnique({
    where: { serverId: member.guild.id }
  })
  if (!welcomeDb) return
  const { channelId, image, message, send } = welcomeDb
  const isValidCanvas = validateCanvas(image)
  const canvas = isValidCanvas ? (image as unknown as Canvas) : null
  const webhook = member.guild.channels.cache.get(channelId) as any
  await webhook?.send(
    {
      embeds: [
        {
          title: ':warning: This module is suspended',
          color: 0xfff000
        },
        {
          title: `Welcome ${member.displayName} ${emojis.kannaAwave}`,
          description: `thanks for participating in ${member.guild.name}`,
          footer: {
            text: `#${member.guild.memberCount}`
          },
          color: 0x00ff00
        }
      ]
    }

    // await SendWelcomeWith({
    //   send,
    //   image: canvas ?? WELCOME,
    //   message: formatterText(message, {
    //     '{{server_count}}': member.guild.memberCount.toString(),
    //     '{{server_name}}': member.guild.name,
    //     '{{user_name}}': member.displayName,
    //     '{{user_id}}': member.id,
    //     '{{user_discriminator}}': member.user.tag
    //   }),
    //   member
    // })
  )
}
