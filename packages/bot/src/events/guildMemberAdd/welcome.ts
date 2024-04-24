import { type GuildMember } from 'discord.js'
import { type Canvas } from '@/types/Canvas.types'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import db from '../../db'
import SendWelcomeWith from '../../shared/sendWelcomeWith'
import { userSecuencies } from '../../shared/messageFormatting'

export default async function welcome(member: GuildMember): Promise<void> {
  const welcomeDb = await db.welcomeCommand.findUnique({
    where: { serverId: member.guild.id }
  })
  if (!welcomeDb) return
  const { channelId, image, message, send } = welcomeDb
  const imageMock: Canvas = JSON.parse(readFileSync(path.join(__dirname, '../../../mocks/welcome.json'), 'utf-8'))
  const webhook = member.guild.channels.cache.get(channelId) as any
  await webhook?.send(
    await SendWelcomeWith({ send, image: image ?? imageMock, message: userSecuencies(message, member), member })
  )
}
