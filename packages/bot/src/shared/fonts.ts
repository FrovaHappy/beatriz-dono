import path from 'node:path'
import { readdirSync } from 'node:fs'
interface Font {
  nameAlias: string
  patch: string
}
function getFonts(): Font[] {
  const fonts: Font[] = []
  const folderPath = path.join('./fonts')
  const fontsFiles = readdirSync(folderPath).filter(
    file => file.endsWith('.ttf') || file.endsWith('.woff') || file.endsWith('.woff2')
  )
  for (const fontFile of fontsFiles) {
    const nameAlias = fontFile.split('.')[0].replace('-', ' ')
    fonts.push({ nameAlias, patch: path.join(folderPath, fontFile) })
  }
  return fonts
}

export default getFonts()
