import emojis from '@/const/emojis'
import db from '@db'
import type { GuildMember } from 'discord.js'
export default async function welcome(member: GuildMember): Promise<void> {
  const welcomeDb = await db.welcome.read(member.guild.id)
  const channel_id = welcomeDb.channel_id
  if (!channel_id) return

  const webhook = member.guild.channels.cache.get(channel_id) as any
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
