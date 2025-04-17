type Color = {
  r: number
  g: number
  b: number
}

function createPixelArray(imgData: Uint8ClampedArray<ArrayBufferLike>) {
  const rgbValues = []
  // note that we are loop in every 4!
  // for every Red, Green, Blue and Alpha
  for (let i = 0; i < imgData.length; i += 4) {
    const rgb = {
      r: imgData[i],
      g: imgData[i + 1],
      b: imgData[i + 2]
    }

    rgbValues.push(rgb)
  }

  return rgbValues
}

const orderByBiggestColorRange = (rgbValues: Color[]) => {
  const componentToSortBy = findBiggestColorRange(rgbValues)
  rgbValues.sort((p1: { [x: string]: number }, p2: { [x: string]: number }) => {
    return p1[componentToSortBy] - p2[componentToSortBy]
  })
  return rgbValues
}

export const findBiggestColorRange = (rgbValues: Color[]) => {
  /**
   * Min is initialized to the maximum value posible
   * from there we proceed to find the minimum value for that color channel
   *
   * Max is initialized to the minimum value posible
   * from there we proceed to fin the maximum value for that color channel
   */
  const max = 256
  const mix = -1
  let rMin = max
  let gMin = max
  let bMin = max

  let rMax = mix
  let gMax = mix
  let bMax = mix

  // biome-ignore lint/complexity/noForEach: <explanation>
  rgbValues.forEach((pixel: { r: number; g: number; b: number }) => {
    rMin = pixel.r
    gMin = pixel.g
    bMin = pixel.b

    rMax = pixel.r
    gMax = pixel.g
    bMax = pixel.b
  })

  const rRange = rMax - rMin
  const gRange = gMax - gMin
  const bRange = bMax - bMin

  // determine which color has the biggest difference
  const biggestRange = Math.max(rRange, gRange, bRange)

  if (biggestRange === rRange) return 'r'
  if (biggestRange === gRange) return 'g'
  return 'b'
}
const quantization = (rgbValues: Color[], depth: number): Color[] => {
  // Base case
  if (depth <= 0 || rgbValues.length <= 2) {
    const color = rgbValues.reduce(
      (prev, curr) => {
        prev.r += curr.r
        prev.g += curr.g
        prev.b += curr.b

        return prev
      },
      { r: 0, g: 0, b: 0 }
    )
    color.r = Math.round(color.r / rgbValues.length) || 0
    color.g = Math.round(color.g / rgbValues.length) || 0
    color.b = Math.round(color.b / rgbValues.length) || 0

    return [color]
  }

  /**
   *  Recursively do the following:
   *  1. Find the pixel channel (red,green or blue) with biggest difference/range
   *  2. Order by this channel
   *  3. Divide in half the rgb colors list
   *  4. Repeat process again, until desired depth or base case
   */
  orderByBiggestColorRange(rgbValues)

  const mid = rgbValues.length / 2
  return [...quantization(rgbValues.slice(0, mid), depth - 1), ...quantization(rgbValues.slice(mid + 1), depth - 1)]
}

//  Convert each pixel value ( number ) to hexadecimal ( string ) with base 16
export function rgbToHex(pixel: Color) {
  const componentToHex = (c: number) => {
    const hex = c.toString(16)
    return hex.padStart(2, '0')
  }
  const color = `#${componentToHex(pixel.r)}${componentToHex(pixel.g)}${componentToHex(pixel.b)}`.toLowerCase()
  if (color === '#000000') return '#000001'
  return color
}

export const hexToRgb = (hex: string): Color | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16)
      }
    : null
}

export const orderByLuminance = (rgbValues: Color[]) => {
  const calculateLuminance = (p: Color) => {
    return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b
  }

  return rgbValues.sort((p1, p2) => {
    return calculateLuminance(p2) - calculateLuminance(p1)
  })
}
type Options = {
  data: Uint8ClampedArray<ArrayBufferLike> | null
  length?: number
  quality?: number
}
/**
 *  Quantization function
 * @param url - url of the image
 * @param length - number of colors to return (1 is the dominante color and 0 is all colors) (default: 0)
 * @param quality - quality of the image (10 is the best quality and 1 is the worst) (default: 4)
 * @returns - returns an array of colors in hexadecimal format (e.g. #ff0000)
 **/
export function getPallete(props: Options) {
  const { data, length = 0, quality = 4 } = props
  const options = { quality, length }
  if (options.quality > 10) options.quality = 10
  if (options.length > 100) options.length = 100
  if (!data) return []
  const pixelArray = createPixelArray(data)
  const palette = quantization(pixelArray, options.quality)
  const colors = options.length >= 1 ? palette.slice(0, options.length) : palette
  return colors.map(rgbToHex)
}
