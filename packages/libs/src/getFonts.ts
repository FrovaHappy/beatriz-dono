import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { format, join } from 'node:path'

// TODO: move to config to Database
const fonts = {
  Roboto: {
    variable: false,
    weight: '400',
    src: 'https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Mu72xKOzY.woff2',
    format: 'woff2'
  },
  'Open Sans': {
    variable: true,
    weight: '300 800',
    src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVI.woff2',
    format: 'woff2'
  },
  Inter: {
    variable: true,
    weight: '400 900',
    src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2',
    format: 'woff2'
  },
  Arvo: {
    variable: false,
    weight: '400',
    src: 'https://fonts.gstatic.com/s/arvo/v22/tDbD2oWUg0MKqScQ7Q.woff2',
    format: 'woff2'
  },
  Caveat: {
    variable: true,
    weight: '400 900',
    src: 'https://fonts.gstatic.com/s/caveat/v18/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9eIWpYQ.woff2',
    format: 'woff2'
  },
  Nunito: {
    variable: true,
    weight: '400 900',
    src: 'https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDLshdTQ3jw.woff2',
    format: 'woff2'
  },
  Montserrat: {
    variable: true,
    weight: '400 900',
    src: 'https://fonts.gstatic.com/s/montserrat/v29/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXo.woff2',
    format: 'woff2'
  },
  Lato: {
    variable: false,
    weight: '400',
    src: 'https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.woff2',
    format: 'woff2'
  },
  Karla: {
    variable: true,
    weight: '400 900',
    src: 'https://fonts.gstatic.com/s/karla/v31/qkBIXvYC6trAT55ZBi1ueQVIjQTD-JqaE0lK.woff2',
    format: 'woff2'
  },
  'Dancing Script': {
    variable: true,
    weight: '400 900',
    src: 'https://fonts.gstatic.com/s/dancingscript/v25/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Sup8.woff2',
    format: 'woff2'
  }
}

export type FontsFamily = keyof typeof fonts
export const fontsFamily = Object.keys(fonts) as FontsFamily[]

export const getFonts = async (root: string) => {
  if (!existsSync(root)) await mkdir(root, { recursive: true })
  const getterFonts = []
  for (const [key, value] of Object.entries(fonts)) {
    const path = join(root, `/${key.replaceAll(' ', '-')}.${value.format}`)
    if (!existsSync(path)) {
      const font = (await fetch(value.src)).body
      const buffer = await new Response(font).arrayBuffer()
      const dataView = new DataView(buffer)
      await writeFile(path, dataView)
    }

    getterFonts.push({
      family: key,
      buffer: path,
      format: value.format,
      variable: value.variable
    })
  }
  return getterFonts
}

export const getCssFonts = () => {
  let cssText = ''
  for (const [key, value] of Object.entries(fonts)) {
    cssText += `
    @font-face {
      font-family: '${key}';
      src: url('${value.src}') format('${value.format}');
      font-weight: ${value.variable ? '100' : '300 800'};
      font-style: normal;
    }
    `
  }
}
