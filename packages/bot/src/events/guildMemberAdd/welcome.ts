import db from '@core/db'
import type { GuildMember } from 'discord.js'
import emojis from '@/const/emojis'
export default async function welcome(member: GuildMember): Promise<void> {
  const welcomeDb = await db.welcomeCommand.findUnique({
    where: { serverId: member.guild.id }
  })
  if (!welcomeDb) return
  const { channelId } = welcomeDb
  // const isValidCanvas = validateCanvas(image)
  //const canvas = isValidCanvas ? (image as unknown as Canvas) : null
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
          description: `thanks for joining ${member.guild.name}`,
          thumbnail: {
            url: member.displayAvatarURL({ size: 512 })
          },
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
