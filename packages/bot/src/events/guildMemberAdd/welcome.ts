import { formatterUser } from '@/services/shared/formatterUser'
import SendWelcomeWith from '@/shared/sendWelcomeWith'
import type { Canvas } from '@/types/Canvas.types'
import db from '@core/db'
import WELCOME from '@lib/welcome'
import type { GuildMember } from 'discord.js'
import { validateCanvas } from '../../services/setWelcome/commands/main/validate'
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
