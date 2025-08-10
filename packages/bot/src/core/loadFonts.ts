import { join } from 'node:path'
import { Timer } from '@/shared/general'
import logger from '@/shared/logger'
import { getFonts } from '@libs/server'
import { GlobalFonts } from '@napi-rs/canvas'

export default async function loadFonts() {
  const time = new Timer()
  const fonts = await getFonts(join(process.cwd(), 'public/fonts'))
  for (const font of fonts) {
    GlobalFonts.registerFromPath(font.buffer, font.family)
  }
  logger({
    type: 'info',
    head: 'Fonts',
    title: 'Loading fonts',
    body: `
      fonts found: ${fonts.length}
      finished in ${time.final()}
    `
  })
}
