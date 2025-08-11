import getPallete, { findBiggestColorRange, hexToRgb, orderByLuminance, rgbToHex } from './palette-generator'
import { getImageData } from './server'

const colorsUri = {
  red: {
    hex: '#ff0000',
    uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAA1BMVEX/AAAZ4gk3AAAAPUlEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvgyZwAABCrx9CgAAAABJRU5ErkJggg==',
  },
  green: {
    hex: '#00ff00',
    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvu_INDlD8hUsDSTN57PE0kYRw07rDTNfOcPySlIyDzw&s',
  },
  blue: {
    hex: '#295592',
    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNRoEqICjVBoHd8uNTOYCtMPs7JcuwJ_fUUNVOO0HIaQTvDIx-HBJ8uQM&s',
  },
}

describe('colors: getPallete', async () => {
  it('should return empty array if the image data is null', () => {
    const color = getPallete({ data: null })
    expect(color).toEqual([])
  })

  it('should return empty array if the image data is undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const color = getPallete({ data: undefined as any })
    expect(color).toEqual([])
  })

  it('should respect quality parameter limits (max 10)', () => {
    const mockData = new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255])
    const color = getPallete({ data: mockData, quality: 15 }) // Should be capped at 10
    expect(Array.isArray(color)).toBe(true)
  })

  it('should respect length parameter limits (max 100)', () => {
    const mockData = new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255])
    const color = getPallete({ data: mockData, length: 150 }) // Should be capped at 100
    expect(Array.isArray(color)).toBe(true)
  })

  it('should return all colors when length is 0', () => {
    const mockData = new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255])
    const colors = getPallete({ data: mockData, length: 0, quality: 1 })
    expect(colors.length).toBeGreaterThan(0)
  })

  it('should return limited colors when length is specified', () => {
    const mockData = new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255])
    const colors = getPallete({ data: mockData, length: 1, quality: 1 })
    expect(colors.length).toBe(1)
  })

  it('should handle single pixel data', () => {
    const mockData = new Uint8ClampedArray([128, 64, 192, 255])
    const colors = getPallete({ data: mockData, length: 1 })
    expect(colors).toHaveLength(1)
    expect(colors[0]).toMatch(/^#[0-9a-f]{6}$/)
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

  it('should return null for invalid hex format', () => {
    expect(hexToRgb('#gg0000')).toBeNull()
    expect(hexToRgb('#ff00')).toBeNull() // too short
    expect(hexToRgb('#ff00000')).toBeNull() // too long
    expect(hexToRgb('')).toBeNull()
    expect(hexToRgb('#')).toBeNull()
  })

  it('should handle hex without # prefix', () => {
    const color = hexToRgb('ff0000')
    expect(color).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('should handle uppercase hex values', () => {
    const color = hexToRgb('#FF0000')
    expect(color).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('should handle lowercase hex values', () => {
    const color = hexToRgb('#ff0000')
    expect(color).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('should handle mixed case hex values', () => {
    const color = hexToRgb('#Ff0000')
    expect(color).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('should parse various color values correctly', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
    expect(hexToRgb('#808080')).toEqual({ r: 128, g: 128, b: 128 })
    expect(hexToRgb('#abcdef')).toEqual({ r: 171, g: 205, b: 239 })
  })
})

describe('colors: rgbToHex', () => {
  it('should return the correct hex for red', () => {
    const color = rgbToHex({ r: 255, g: 0, b: 0 })
    expect(color).toEqual('#ff0000')
  })

  it('should return the correct hex for green', () => {
    const color = rgbToHex({ r: 0, g: 255, b: 0 })
    expect(color).toEqual('#00ff00')
  })

  it('should return the correct hex for blue', () => {
    const color = rgbToHex({ r: 0, g: 0, b: 255 })
    expect(color).toEqual('#0000ff')
  })

  it('should return the correct hex for white', () => {
    const color = rgbToHex({ r: 255, g: 255, b: 255 })
    expect(color).toEqual('#ffffff')
  })

  it('should return #000001 instead of #000000 for black', () => {
    const color = rgbToHex({ r: 0, g: 0, b: 0 })
    expect(color).toEqual('#000001')
  })

  it('should pad single digit hex values with zero', () => {
    const color = rgbToHex({ r: 1, g: 2, b: 3 })
    expect(color).toEqual('#010203')
  })

  it('should handle middle range values', () => {
    const color = rgbToHex({ r: 128, g: 64, b: 192 })
    expect(color).toEqual('#8040c0')
  })

  it('should always return lowercase hex', () => {
    const color = rgbToHex({ r: 171, g: 205, b: 239 })
    expect(color).toEqual('#abcdef')
    expect(color).toBe(color.toLowerCase())
  })
})

describe('colors: findBiggestColorRange', () => {
  it('should return "r" when red has the biggest range', () => {
    const colors = [
      { r: 0, g: 100, b: 100 },
      { r: 255, g: 110, b: 110 }, // Red range: 255, Green range: 10, Blue range: 10
      { r: 128, g: 105, b: 105 },
    ]
    expect(findBiggestColorRange(colors)).toBe('r')
  })

  it('should return "g" when green has the biggest range', () => {
    const colors = [
      { r: 100, g: 0, b: 100 },
      { r: 110, g: 255, b: 110 }, // Red range: 10, Green range: 255, Blue range: 10
      { r: 105, g: 128, b: 105 },
    ]
    expect(findBiggestColorRange(colors)).toBe('g')
  })

  it('should return "b" when blue has the biggest range', () => {
    const colors = [
      { r: 100, g: 100, b: 0 },
      { r: 110, g: 110, b: 255 }, // Red range: 10, Green range: 10, Blue range: 255
      { r: 105, g: 105, b: 128 },
    ]
    expect(findBiggestColorRange(colors)).toBe('b')
  })

  it('should handle equal ranges (returns first match - "r")', () => {
    const colors = [
      { r: 0, g: 0, b: 0 },
      { r: 100, g: 100, b: 100 },
    ]
    expect(findBiggestColorRange(colors)).toBe('r') // All ranges are equal, returns 'r' first
  })

  it('should handle single color (no range, returns "r")', () => {
    const colors = [{ r: 128, g: 128, b: 128 }]
    expect(findBiggestColorRange(colors)).toBe('r') // No range, returns 'r' by default
  })

  it('should handle edge values (0 and 255)', () => {
    const colors = [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    ]
    expect(findBiggestColorRange(colors)).toBe('r') // All ranges are equal (255), returns 'r' first
  })
})

describe('colors: orderByLuminance', () => {
  it('should order colors by luminance (brightest first)', () => {
    const colors = [
      { r: 0, g: 0, b: 0 }, // Black (lowest luminance)
      { r: 255, g: 255, b: 255 }, // White (highest luminance)
      { r: 128, g: 128, b: 128 }, // Gray (middle luminance)
    ]

    const ordered = orderByLuminance([...colors]) // Clone to avoid mutation

    // Should be ordered: White, Gray, Black
    expect(ordered[0]).toEqual({ r: 255, g: 255, b: 255 })
    expect(ordered[1]).toEqual({ r: 128, g: 128, b: 128 })
    expect(ordered[2]).toEqual({ r: 0, g: 0, b: 0 })
  })

  it('should handle pure colors correctly', () => {
    const colors = [
      { r: 255, g: 0, b: 0 }, // Red
      { r: 0, g: 255, b: 0 }, // Green (higher luminance due to green weight)
      { r: 0, g: 0, b: 255 }, // Blue (lowest luminance due to blue weight)
    ]

    const ordered = orderByLuminance([...colors])

    // Green should be first (0.7152 weight), then Red (0.2126 weight), then Blue (0.0722 weight)
    expect(ordered[0]).toEqual({ r: 0, g: 255, b: 0 })
    expect(ordered[1]).toEqual({ r: 255, g: 0, b: 0 })
    expect(ordered[2]).toEqual({ r: 0, g: 0, b: 255 })
  })

  it('should preserve original array and return new sorted array', () => {
    const original = [
      { r: 0, g: 0, b: 0 },
      { r: 255, g: 255, b: 255 },
    ]
    const originalCopy = [...original]

    const ordered = orderByLuminance(original)

    // Original array should be modified (sort mutates)
    expect(original).not.toEqual(originalCopy)
    expect(ordered).toBe(original) // Same reference
  })

  it('should handle empty array', () => {
    const colors: Array<{ r: number; g: number; b: number }> = []
    const ordered = orderByLuminance(colors)
    expect(ordered).toEqual([])
  })

  it('should handle single color', () => {
    const colors = [{ r: 128, g: 64, b: 192 }]
    const ordered = orderByLuminance([...colors])
    expect(ordered).toEqual(colors)
  })
})

describe('colors: Edge Cases and Integration', () => {
  it('should handle getPallete with very small data array', () => {
    const mockData = new Uint8ClampedArray([255, 0, 0, 255]) // Single red pixel
    const colors = getPallete({ data: mockData, length: 5, quality: 1 })
    expect(colors.length).toBe(1)
    expect(colors[0]).toBe('#ff0000')
  })

  it('should handle getPallete with default parameters', () => {
    const mockData = new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255])
    const colors = getPallete({ data: mockData })
    expect(Array.isArray(colors)).toBe(true)
    expect(colors.length).toBeGreaterThan(0)
  })

  it('should convert between hex and rgb consistently', () => {
    const testColors = [
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 255, b: 0 },
      { r: 0, g: 0, b: 255 },
      { r: 128, g: 64, b: 192 },
      { r: 255, g: 255, b: 255 },
    ]

    for (const color of testColors) {
      const hex = rgbToHex(color)
      const backToRgb = hexToRgb(hex)
      expect(backToRgb).toEqual(color)
    }
  })

  it('should handle black color special case consistently', () => {
    const black = { r: 0, g: 0, b: 0 }
    const hex = rgbToHex(black)
    expect(hex).toBe('#000001') // Should be converted to avoid pure black

    const backToRgb = hexToRgb(hex)
    expect(backToRgb).toEqual({ r: 0, g: 0, b: 1 }) // Should not be original black
  })

  it('should handle findBiggestColorRange with tied values', () => {
    // Test with red and green tied, blue different
    const colors1 = [
      { r: 0, g: 0, b: 50 },
      { r: 100, g: 100, b: 60 },
    ]
    expect(findBiggestColorRange(colors1)).toBe('r') // r and g tied, r wins

    // Test with green and blue tied, red different
    const colors2 = [
      { r: 50, g: 0, b: 0 },
      { r: 60, g: 100, b: 100 },
    ]
    expect(findBiggestColorRange(colors2)).toBe('g') // g and b tied, g wins
  })
})
