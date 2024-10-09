import { GlobalFonts, Path2D as Path, createCanvas, loadImage } from '@napi-rs/canvas'
import { AttachmentBuilder, type GuildMember } from 'discord.js'

import type { Canvas, Image, Layer } from '@/types/Canvas.types'
import renderCanvas from '@libs/renderCanvas'
// load Fonts
import fonts from './fonts'
for (const font of fonts) {
  GlobalFonts.registerFromPath(font.patch, font.nameAlias)
}

export default async function buildWelcomeImage(data: Canvas, member: GuildMember): Promise<AttachmentBuilder> {
  const user = {
    avatar: member.user.avatarURL() ?? config.imageAvatar,
    count: member.guild.memberCount.toString(),
    globalName: member.user.globalName ?? member.user.username,
    id: member.user.id,
    username: member.user.username
  }
  const { layers, ...base } = data
  const canvas = createCanvas(data.width, data.height)
  const ctx = canvas.getContext('2d')

  const images: Record<string, HTMLImageElement> = {}
  for (const l of layers) {
    if (l.type === 'image') {
      images[l.id] = (await loadImage((l as Layer<Image>).img ?? config.imageTransparent)) as unknown as HTMLImageElement
    }
    if (l.type === 'icon') {
      images[l.id] = (await loadImage(user.avatar)) as unknown as HTMLImageElement
    }
  }
  renderCanvas(layers, base, user, ctx as unknown as CanvasRenderingContext2D, Path as typeof Path2D, images)
  const extension = 'png'

  return new AttachmentBuilder(await canvas.encode(extension), { name: `welcome.${extension}` })
}
