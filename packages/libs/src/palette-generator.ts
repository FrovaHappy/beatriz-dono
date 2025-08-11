// Types
interface Color {
  r: number
  g: number
  b: number
}

type ColorChannel = 'r' | 'g' | 'b'

interface ColorRange {
  min: number
  max: number
  range: number
}

interface PaletteOptions {
  data: Uint8ClampedArray<ArrayBufferLike> | null
  length?: number
  quality?: number
}

// Constants
const COLOR_CONSTANTS = {
  MAX_RGB_VALUE: 255,
  MIN_RGB_VALUE: 0,
  RGBA_PIXEL_SIZE: 4,
  MAX_QUALITY: 10,
  MAX_PALETTE_LENGTH: 100,
  HEX_BASE: 16,
  HEX_PAD_LENGTH: 2,
  BLACK_HEX_REPLACEMENT: '#000001',
  // Luminance calculation constants (ITU-R BT.709)
  LUMINANCE_WEIGHTS: {
    r: 0.2126,
    g: 0.7152,
    b: 0.0722,
  },
} as const

/**
 * Creates an array of RGB color objects from image data
 * Skips alpha channel (every 4th value in the Uint8ClampedArray)
 */
function createPixelArray(imgData: Uint8ClampedArray<ArrayBufferLike>): Color[] {
  const rgbValues: Color[] = []

  // Process every 4 bytes: Red, Green, Blue, Alpha (skip Alpha)
  for (let i = 0; i < imgData.length; i += COLOR_CONSTANTS.RGBA_PIXEL_SIZE) {
    const rgb: Color = {
      r: imgData[i],
      g: imgData[i + 1],
      b: imgData[i + 2],
    }
    rgbValues.push(rgb)
  }

  return rgbValues
}

/**
 * Calculates the range (max - min) for each color channel in an array of colors
 */
function calculateColorRanges(rgbValues: Color[]): Record<ColorChannel, ColorRange> {
  const ranges: Record<ColorChannel, ColorRange> = {
    r: { min: COLOR_CONSTANTS.MAX_RGB_VALUE + 1, max: COLOR_CONSTANTS.MIN_RGB_VALUE - 1, range: 0 },
    g: { min: COLOR_CONSTANTS.MAX_RGB_VALUE + 1, max: COLOR_CONSTANTS.MIN_RGB_VALUE - 1, range: 0 },
    b: { min: COLOR_CONSTANTS.MAX_RGB_VALUE + 1, max: COLOR_CONSTANTS.MIN_RGB_VALUE - 1, range: 0 },
  }

  // Find min and max for each color channel
  for (const pixel of rgbValues) {
    for (const channel of ['r', 'g', 'b'] as const) {
      ranges[channel].min = Math.min(ranges[channel].min, pixel[channel])
      ranges[channel].max = Math.max(ranges[channel].max, pixel[channel])
    }
  }

  // Calculate ranges
  for (const channel of ['r', 'g', 'b'] as const) {
    ranges[channel].range = ranges[channel].max - ranges[channel].min
  }

  return ranges
}

/**
 * Finds the color channel (r, g, or b) with the biggest difference/range
 * Used for determining the optimal axis for color quantization
 */
export function findBiggestColorRange(rgbValues: Color[]): ColorChannel {
  if (rgbValues.length === 0) return 'r'

  const ranges = calculateColorRanges(rgbValues)

  // Find the channel with the maximum range
  let biggestChannel: ColorChannel = 'r'
  let biggestRange = ranges.r.range

  if (ranges.g.range > biggestRange) {
    biggestChannel = 'g'
    biggestRange = ranges.g.range
  }

  if (ranges.b.range > biggestRange) {
    biggestChannel = 'b'
  }

  return biggestChannel
}

/**
 * Sorts an array of colors by the specified color channel
 * Mutates the original array for performance
 */
function sortByColorChannel(rgbValues: Color[], channel: ColorChannel): Color[] {
  return rgbValues.sort((p1, p2) => p1[channel] - p2[channel])
}

/**
 * Orders colors by the color channel with the biggest range
 * This is used in the quantization algorithm to optimally divide color space
 */
function orderByBiggestColorRange(rgbValues: Color[]): Color[] {
  const componentToSortBy = findBiggestColorRange(rgbValues)
  return sortByColorChannel(rgbValues, componentToSortBy)
}
/**
 * Calculates the average color from an array of colors
 */
function calculateAverageColor(rgbValues: Color[]): Color {
  if (rgbValues.length === 0) {
    return { r: 0, g: 0, b: 0 }
  }

  const sum = rgbValues.reduce(
    (acc, curr) => ({
      r: acc.r + curr.r,
      g: acc.g + curr.g,
      b: acc.b + curr.b,
    }),
    { r: 0, g: 0, b: 0 }
  )

  return {
    r: Math.round(sum.r / rgbValues.length),
    g: Math.round(sum.g / rgbValues.length),
    b: Math.round(sum.b / rgbValues.length),
  }
}

/**
 * Recursive color quantization using median cut algorithm
 * Reduces the number of colors in an image by repeatedly dividing color space
 *
 * @param rgbValues - Array of RGB color values
 * @param depth - Recursion depth (higher = more colors in result)
 * @returns Array of representative colors
 */
function quantization(rgbValues: Color[], depth: number): Color[] {
  // Base case: stop recursion if depth reached or too few colors
  if (depth <= 0 || rgbValues.length <= 2) {
    return [calculateAverageColor(rgbValues)]
  }

  /**
   * Median cut algorithm:
   * 1. Find the color channel with the biggest range
   * 2. Sort colors by this channel
   * 3. Split the array in half
   * 4. Recursively quantize each half
   */
  orderByBiggestColorRange(rgbValues)

  const mid = Math.floor(rgbValues.length / 2)
  return [
    ...quantization(rgbValues.slice(0, mid), depth - 1),
    ...quantization(rgbValues.slice(mid), depth - 1),
  ]
}

/**
 * Converts a single color component (0-255) to hexadecimal string
 */
function componentToHex(component: number): string {
  const hex = component.toString(COLOR_CONSTANTS.HEX_BASE)
  return hex.padStart(COLOR_CONSTANTS.HEX_PAD_LENGTH, '0')
}

/**
 * Converts RGB color values to hexadecimal format
 * Special case: pure black (#000000) is converted to #000001 to avoid issues
 *
 * @param pixel - RGB color object
 * @returns Hexadecimal color string (lowercase)
 */
export function rgbToHex(pixel: Color): string {
  const color =
    `#${componentToHex(pixel.r)}${componentToHex(pixel.g)}${componentToHex(pixel.b)}`.toLowerCase()

  // Avoid pure black which might cause issues in some contexts
  if (color === '#000000') {
    return COLOR_CONSTANTS.BLACK_HEX_REPLACEMENT
  }

  return color
}

/**
 * Converts hexadecimal color string to RGB color object
 * Supports both formats: #ffffff and ffffff
 *
 * @param hex - Hexadecimal color string
 * @returns RGB color object or null if invalid format
 */
export function hexToRgb(hex: string): Color | null {
  const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
  const result = hexRegex.exec(hex)

  if (!result) {
    return null
  }

  return {
    r: Number.parseInt(result[1], COLOR_CONSTANTS.HEX_BASE),
    g: Number.parseInt(result[2], COLOR_CONSTANTS.HEX_BASE),
    b: Number.parseInt(result[3], COLOR_CONSTANTS.HEX_BASE),
  }
}

/**
 * Calculates the relative luminance of an RGB color
 * Uses ITU-R BT.709 standard weights for accurate perceived brightness
 */
function calculateLuminance(color: Color): number {
  const { r, g, b } = COLOR_CONSTANTS.LUMINANCE_WEIGHTS
  return r * color.r + g * color.g + b * color.b
}

/**
 * Sorts an array of colors by luminance (perceived brightness)
 * Mutates the original array and returns it
 *
 * @param rgbValues - Array of RGB colors to sort
 * @returns The same array sorted by luminance (brightest first)
 */
export function orderByLuminance(rgbValues: Color[]): Color[] {
  return rgbValues.sort((p1, p2) => {
    return calculateLuminance(p2) - calculateLuminance(p1)
  })
}

/**
 * Validates and normalizes palette generation options
 */
function validatePaletteOptions(options: PaletteOptions): { quality: number; length: number } {
  let { quality = 4, length = 0 } = options

  // Clamp quality to valid range
  quality = Math.min(Math.max(1, quality), COLOR_CONSTANTS.MAX_QUALITY)

  // Clamp length to valid range
  length = Math.min(Math.max(0, length), COLOR_CONSTANTS.MAX_PALETTE_LENGTH)

  return { quality, length }
}

/**
 * Extracts a color palette from image data using median cut quantization
 *
 * @param props - Configuration object
 * @param props.data - Image data as Uint8ClampedArray (RGBA format)
 * @param props.length - Number of colors to return (0 = all colors, max 100)
 * @param props.quality - Quantization depth (1-10, higher = more accurate)
 * @returns Array of hexadecimal color strings
 */
function getPallete(props: PaletteOptions): string[] {
  const { data } = props

  // Early return for invalid data
  if (!data || data.length === 0) {
    return []
  }

  const options = validatePaletteOptions(props)

  try {
    const pixelArray = createPixelArray(data)

    if (pixelArray.length === 0) {
      return []
    }

    const palette = quantization(pixelArray, options.quality)
    const colors = options.length >= 1 ? palette.slice(0, options.length) : palette

    return colors.map(rgbToHex)
  } catch (error) {
    console.warn('Error generating color palette:', error)
    return []
  }
}

// Default export
export default getPallete

// Named export for backward compatibility
export { getPallete }
