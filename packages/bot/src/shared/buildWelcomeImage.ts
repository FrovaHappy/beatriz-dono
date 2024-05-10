import { GlobalFonts, createCanvas, Path2D as Path, loadImage } from '@napi-rs/canvas'
import { AttachmentBuilder, type GuildMember } from 'discord.js'

// load Fonts
import fonts from './fonts'
import renderCanvas from '@lib/renderCanvas'
import type { Canvas } from '@/types/Canvas.types'
for (const font of fonts) {
  GlobalFonts.registerFromPath(font.patch, font.nameAlias)
}

export default async function buildWelcomeImage(data: Canvas, member: GuildMember): Promise<AttachmentBuilder> {
  const user = {
    avatar: member.avatarURL() ?? '',
    count: member.guild.memberCount.toString(),
    globalName: member.user.globalName ?? member.user.username,
    id: member.user.id,
    username: member.user.username
  }
  const { layers, ...base } = data
  const canvas = createCanvas(data.width, data.height)
  const ctx = canvas.getContext('2d')
  await renderCanvas(
    layers,
    base,
    user,
    ctx as unknown as CanvasRenderingContext2D,
    Path as typeof Path2D,
    loadImage as unknown as (path: string) => Promise<HTMLImageElement>
  )
  const extension = 'png'

  return new AttachmentBuilder(await canvas.encode(extension), { name: `welcome.${extension}` })
}
