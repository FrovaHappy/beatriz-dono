import { Path2D as Path, createCanvas, loadImage } from '@napi-rs/canvas'
import { AttachmentBuilder, type GuildMember } from 'discord.js'

import type { Canvas } from '@type/index'
import PaintCanvas from '@libs/PaintCanvas'
import type { User, Guild } from '@type/index'
import { getDominanteColor, rgbToHex } from '@libs/colors'
import { isShape } from '@libs/PaintCanvas/schema.welcome.v1'

const getColorCast = async (layerId: string | undefined, layers: Canvas['layers']) => {
  if (!layerId) return undefined
  const layer = layers.find(l => l.id === layerId)
  if (!layer) return
  let color: string | undefined

  if (isShape(layer) && layer.image) return rgbToHex(await getDominanteColor(layer.image, 10))
  color = layer.color
  if (color === 'auto') color = undefined
  if (color === 'transparent') color = undefined

  return color
}

export default async function buildWelcomeImage(data: Canvas, member: GuildMember): Promise<AttachmentBuilder> {
  const filterText: User & Guild = {
    userName: member.user.globalName ?? member.user.username,
    userId: member.user.id,
    userDiscriminator: member.user.discriminator,
    userDisplayName: member.user.displayName,
    userAvatar: member.displayAvatarURL(),
    userBanner: member.user.bannerURL() ?? undefined,
    membersCount: member.guild.memberCount.toString(),
    guildAvatar: member.guild.members.me?.displayAvatarURL() ?? config.imageAvatar,
    guildBanner: member.guild.bannerURL() ?? undefined,
    guildName: member.guild.name,
    guildId: member.guild.id
  }
  const { layers } = data
  const canvas = createCanvas(data.w, data.h)
  const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D
  console.time('fetchImages')
  const images: Record<string, HTMLImageElement> = {}
  const resolveImages = []
  for (const layer of layers) {
    if (!isShape(layer)) continue
    resolveImages.push(async () => {
      if (!layer.image) return
      images[layer.id] = (await loadImage(layer.image)) as unknown as HTMLImageElement
    })
  }
  await Promise.allSettled(resolveImages.map(fn => fn()))
  const castColor = await getColorCast(data.layerCastColor, layers)
  console.log(castColor)
  console.timeEnd('fetchImages')
  PaintCanvas({
    ctx,
    canvas: data,
    Path2D: Path as unknown as typeof Path2D,
    images,
    filterText,
    castColor
  })
  const extension = 'png'

  return new AttachmentBuilder(await canvas.encode(extension), { name: `welcome.${extension}` })
}
