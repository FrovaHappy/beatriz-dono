import type { Canvas } from '@libs/PaintCanvas/schema.welcome.v1'
import type { GuildMember } from 'discord.js'
import buildWelcomeImage from './buildWelcomeImage'
interface Props {
  message: string
  image: Canvas
  send: string
  member: GuildMember | null
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async function SendWelcomeWith({ image, message, send, member }: Props) {
  const canSend = {
    image: send === 'alone_image' || send === 'all',
    message: send === 'alone_message' || send === 'all'
  }
  const content = canSend.message ? message : undefined
  const files = []
  if (image && member && canSend.image) files.push(await buildWelcomeImage(image, member))
  return { content, files }
}
