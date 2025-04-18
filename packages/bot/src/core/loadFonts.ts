import { join } from 'node:path'
import { getFonts } from '@libs/getFonts'
import { GlobalFonts } from '@napi-rs/canvas'

export default async function loadFonts() {
  console.time('loadFonts')
  const fonts = await getFonts(join(process.cwd(), 'public/fonts'))
  for (const font of fonts) {
    GlobalFonts.registerFromPath(font.buffer, font.family)
  }
  console.timeEnd('loadFonts')
}
