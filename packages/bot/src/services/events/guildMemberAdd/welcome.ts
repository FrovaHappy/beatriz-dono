import { type GuildMember } from 'discord.js'
import db from '@core/db'
import SendWelcomeWith from '@/shared/sendWelcomeWith'
import WELCOME from '@lib/welcome'
import { validateCanvas } from '../../commands/setWelcome/validate'
import { type Canvas } from '@/types/Canvas.types'
import { formatterUser } from '@/services/shared/formatterUser'
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
    await SendWelcomeWith({
      send,
      image: canvas ?? WELCOME,
      message: formatterUser(message, member.user, member.guild.memberCount),
      member
    })
  )
}
