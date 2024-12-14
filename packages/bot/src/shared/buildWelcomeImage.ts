import { Path2D as Path, createCanvas, loadImage } from '@napi-rs/canvas'
import { AttachmentBuilder, type GuildMember } from 'discord.js'

import { isShape, type Canvas } from '@libs/schemas/schema.welcome.v1'
import PaintCanvas from '@libs/PaintCanvas'
import type { User, Guild } from '@type/index'

export default async function buildWelcomeImage(data: Canvas, member: GuildMember): Promise<AttachmentBuilder> {
  const filterText: User & Guild = {
    userName: member.user.globalName ?? member.user.username,
    userId: member.user.id,
    userDiscriminator: member.user.discriminator,
    userDisplayName: member.user.displayName,
    userAvatar: member.user.avatarURL() ?? config.imageAvatar,
    userBanner: member.user.bannerURL() ?? undefined,
    membersCount: member.guild.memberCount.toString(),
    guildAvatar: member.user.avatarURL() ?? config.imageAvatar,
    guildBanner: member.guild.bannerURL() ?? undefined,
    guildName: member.guild.name,
    guildId: member.guild.id
  }
  const { layers } = data
  const canvas = createCanvas(data.w, data.h)
  const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D

  const images: Record<string, HTMLImageElement> = {}
  for (const layer of layers) {
    if (!isShape(layer)) continue
    if (!layer.image) continue
    images[layer.id] = (await loadImage(layer.image)) as unknown as HTMLImageElement
  }
  PaintCanvas({
    ctx,
    canvas: data,
    Path2D: Path as unknown as typeof Path2D,
    images,
    filterText
  })
  const extension = 'png'

  return new AttachmentBuilder(await canvas.encode(extension), { name: `welcome.${extension}` })
}
