// import { Path2D as Path, createCanvas, loadImage } from '@napi-rs/canvas'
// import { AttachmentBuilder, type GuildMember } from 'discord.js'

// import PaintCanvas from '@libs/PaintCanvas'
// import { isShape } from '@libs/PaintCanvas/schema.welcome.v1'
// import { getPallete, rgbToHex } from '@libs/colors'
// import { formatterTextUser } from '@libs/formatterText'
// import type { Canvas } from '@type/index'
// import type { Guild, User } from '@type/index'

// const getColorCast = async (layerId: string | undefined, layers: Canvas['layers']) => {
//   // if (!layerId) return undefined
//   // const layer = layers.find(l => l.id === layerId)
//   // if (!layer) return
//   // let color: string | undefined
//   // if (isShape(layer) && layer.image) {
//   //   const colors = (await getPallete(layer.image, 1, 2))?.map(c => rgbToHex(c))
//   //   console.log(colors)
//   //   return colors?.[0]
//   // }
//   // color = layer.color
//   // if (color === 'auto') color = undefined
//   // if (color === 'transparent') color = undefined

//   // return color
// }
// const getImages = async (layers: Canvas['layers'], filterText: User & Guild) => {
//   const images: Record<string, HTMLImageElement> = {}
//   const resolveImages = []
//   for (const layer of layers) {
//     if (!isShape(layer)) continue
//     resolveImages.push(async () => {
//       if (!layer.image) return
//       const url = formatterTextUser(layer.image, filterText)
//       images[layer.id] = (await loadImage(url)) as unknown as HTMLImageElement
//     })
//   }
//   await Promise.allSettled(resolveImages.map(fn => fn()))
//   return images
// }

// export default async function buildWelcomeImage(data: Canvas, member: GuildMember): Promise<AttachmentBuilder> {
//   const filterText: User & Guild = {
//     userName: member.user.globalName ?? member.user.username,
//     userId: member.user.id,
//     userDiscriminator: member.user.discriminator,
//     userDisplayName: member.user.displayName,
//     userAvatar: member.displayAvatarURL(),
//     userBanner: member.user.bannerURL() ?? undefined,
//     membersCount: member.guild.memberCount.toString(),
//     guildAvatar: member.guild.members.me?.displayAvatarURL() ?? config.utils.imageAvatar,
//     guildBanner: member.guild.bannerURL() ?? undefined,
//     guildName: member.guild.name,
//     guildId: member.guild.id
//   }
//   // load images
//   console.time('fetchImages')
//   const images = await getImages(data.layers, filterText)
//   const castColor = await getColorCast(data.layerCastColor, data.layers)
//   console.timeEnd('fetchImages')

//   // create canvas
//   const canvas = createCanvas(data.w, data.h)
//   const canvasImage = createCanvas(data.w, data.h)
//   const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D
//   const ctxImage = canvasImage.getContext('2d') as unknown as CanvasRenderingContext2D
//   // render canvas
//   PaintCanvas({
//     ctx,
//     ctxSupport: ctxImage,
//     canvas: data,
//     Path2D: Path as unknown as typeof Path2D,
//     images,
//     filterText,
//     castColor
//   })
//   const extension = 'png'

//   return new AttachmentBuilder(await canvas.encode(extension), { name: `welcome.${extension}` })
// }
