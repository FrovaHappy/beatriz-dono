import type { Canvas } from '@libs/schemas/schema.welcome.v1'
import { SendWelcome } from '@prisma/client'
import type { GuildMember } from 'discord.js'
import buildWelcomeImage from './buildWelcomeImage'
interface Props {
  message: string
  image: Canvas
  send: SendWelcome
  member: GuildMember | null
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async function SendWelcomeWith({ image, message, send, member }: Props) {
  const canSend = {
    image: send === SendWelcome.alone_image || send === SendWelcome.all,
    message: send === SendWelcome.alone_message || send === SendWelcome.all
  }
  const content = canSend.message ? message : undefined
  const files = []
  if (image && member && canSend.image) files.push(await buildWelcomeImage(image, member))
  return { content, files }
}
