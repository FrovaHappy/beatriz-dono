import { getImageData } from './server'
import { getPallete, hexToRgb, rgbToHex } from './colors'

const colorsUri = {
  red: {
    hex: '#ff0000',
    uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAA1BMVEX/AAAZ4gk3AAAAPUlEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvgyZwAABCrx9CgAAAABJRU5ErkJggg=='
  },
  green: {
    hex: '#00ff00',
    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvu_INDlD8hUsDSTN57PE0kYRw07rDTNfOcPySlIyDzw&s'
  },
  blue: {
    hex: '#295592',
    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNRoEqICjVBoHd8uNTOYCtMPs7JcuwJ_fUUNVOO0HIaQTvDIx-HBJ8uQM&s'
  }
}

describe('colors: getPallete', async () => {
  it('should return null if the image is not found', async () => {
    const color = getPallete({ data: null })
    expect(color).toEqual([])
  })
  for (const color of Object.values(colorsUri)) {
    it(`should return ${color.hex}`, async () => {
      const data = (await getImageData(color.uri))?.data ?? null
      const getterColor = getPallete({ data, length: 1 })
      expect(getterColor).toEqual([color.hex])
    })
  }
})
describe('colors: hexToRgb', () => {
  it('should return null if the hex is not valid', () => {
    const color = hexToRgb('#ff')
    expect(color).toBeNull()
  })
  it('should return the correct color', () => {
    const color = hexToRgb('#ff0000')
    expect(color).toEqual({ r: 255, g: 0, b: 0 })
  })
})

describe('colors: rgbToHex', () => {
  it('should return the correct hex', () => {
    const color = rgbToHex({ r: 255, g: 0, b: 0 })
    expect(color).toEqual('#ff0000')
  })
  it('should return the color #000001 if the color is black', () => {
    const color = rgbToHex({ r: 0, g: 0, b: 0 })
    expect(color).toEqual('#000001')
  })
})
