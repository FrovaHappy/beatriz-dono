import { GlobalFonts, createCanvas, Path2D as Path, loadImage } from '@napi-rs/canvas'
import { AttachmentBuilder, type GuildMember } from 'discord.js'

// load Fonts
import fonts from './fonts'
import renderCanvas from '@lib/renderCanvas'
import type { Canvas, Layer, Image } from '@/types/Canvas.types'
for (const font of fonts) {
  GlobalFonts.registerFromPath(font.patch, font.nameAlias)
}

export default async function buildWelcomeImage(data: Canvas, member: GuildMember): Promise<AttachmentBuilder> {
  const user = {
    avatar: member.avatarURL() ?? 'https://i.imgur.com/LB7cfKh.png',
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
      images[l.id] = (await loadImage(
        (l as Layer<Image>).img ?? 'https://i.imgur.com/m8BHGOt.png'
      )) as unknown as HTMLImageElement
    }
    if (l.type === 'icon') {
      images[l.id] = (await loadImage(user.avatar)) as unknown as HTMLImageElement
    }
  }
  renderCanvas(layers, base, user, ctx as unknown as CanvasRenderingContext2D, Path as typeof Path2D, images)
  const extension = 'png'

  return new AttachmentBuilder(await canvas.encode(extension), { name: `welcome.${extension}` })
}
