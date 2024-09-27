export async function getFonts() {
  const fonts = [
    {
      name: 'Inter',
      path: '/fonts/Inter.ttf'
    },
    {
      name: 'Lato',
      path: '/fonts/Lato.ttf'
    },
    {
      name: 'Karla',
      path: '/fonts/Karla.ttf'
    },
    {
      name: 'Karla Italic',
      path: '/fonts/Karla-Italic.ttf'
    },
    {
      name: 'Nunito',
      path: '/fonts/Nunito.ttf'
    },
    {
      name: 'Nunito Italic',
      path: '/fonts/Nunito-Italic.ttf'
    },
    { name: 'Montserrat', path: '/fonts/Montserrat.ttf' },

    { name: 'Montserrat Italic', path: '/fonts/Montserrat-Italic.ttf' },
    {
      name: 'Roboto',
      path: '/fonts/Roboto.ttf'
    },
    {
      name: 'DancingScript',
      path: '/fonts/DancingScript.ttf'
    }
  ]
  for await (const font of fonts) {
    const fontPath = font.path
    const fontName = font.name
    const fontFace = new FontFace(fontName, `url(${fontPath})`)
    await fontFace.load()
    document.fonts.add(fontFace)
  }
}
