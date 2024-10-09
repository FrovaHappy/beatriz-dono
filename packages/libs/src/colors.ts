import getPixels from 'get-pixels'

type PixelData = Parameters<Parameters<typeof getPixels>[2]>[1]
type Color = {
  r: number
  g: number
  b: number
}
function createPixelArray(imgData: PixelData['data']) {
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

function loadImg(img: string) {
  return new Promise<PixelData>((resolve, reject) => {
    getPixels(img, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
const findBiggestColorRange = (rgbValues: Color[]) => {
  /**
   * Min is initialized to the maximum value posible
   * from there we proceed to find the minimum value for that color channel
   *
   * Max is initialized to the minimum value posible
   * from there we proceed to fin the maximum value for that color channel
   */
  let rMin = Number.MAX_VALUE
  let gMin = Number.MAX_VALUE
  let bMin = Number.MAX_VALUE

  let rMax = Number.MIN_VALUE
  let gMax = Number.MIN_VALUE
  let bMax = Number.MIN_VALUE

  // biome-ignore lint/complexity/noForEach: <explanation>
  rgbValues.forEach((pixel: { r: number; g: number; b: number }) => {
    rMin = Math.min(rMin, pixel.r)
    gMin = Math.min(gMin, pixel.g)
    bMin = Math.min(bMin, pixel.b)

    rMax = Math.max(rMax, pixel.r)
    gMax = Math.max(gMax, pixel.g)
    bMax = Math.max(bMax, pixel.b)
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

    color.r = Math.round(color.r / rgbValues.length)
    color.g = Math.round(color.g / rgbValues.length)
    color.b = Math.round(color.b / rgbValues.length)

    return [color]
  }

  /**
   *  Recursively do the following:
   *  1. Find the pixel channel (red,green or blue) with biggest difference/range
   *  2. Order by this channel
   *  3. Divide in half the rgb colors list
   *  4. Repeat process again, until desired depth or base case
   */
  const componentToSortBy = findBiggestColorRange(rgbValues)
  rgbValues.sort((p1: { [x: string]: number }, p2: { [x: string]: number }) => {
    return p1[componentToSortBy] - p2[componentToSortBy]
  })

  const mid = rgbValues.length / 2
  return [...quantization(rgbValues.slice(0, mid), depth - 1), ...quantization(rgbValues.slice(mid + 1), depth - 1)]
}

//  Convert each pixel value ( number ) to hexadecimal ( string ) with base 16
export function rgbToHex(pixel: Color) {
  const componentToHex = (c: number) => {
    const hex = c.toString(16)
    return hex.padStart(2, '0')
  }

  return `#${componentToHex(pixel.r)}${componentToHex(pixel.g)}${componentToHex(pixel.b)}`.toLowerCase()
}

export const orderByLuminance = (rgbValues: Color[]) => {
  const calculateLuminance = (p: Color) => {
    return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b
  }

  return rgbValues.sort((p1, p2) => {
    return calculateLuminance(p2) - calculateLuminance(p1)
  })
}
/**
 *  Quantization function
 * @param url - url of the image
 * @param colorCount - number of colors to return (1 is the dominante color and 0 is all colors)
 * @param quality - quality of the image (10 is the best quality and 1 is the worst)
 * @returns - array of colors in the format { r: number, g: number, b: number }
 **/

export async function getPallete(url: string, colorCount: number, quality: number) {
  const options = { quality, colorCount }
  if (options.quality < 10) options.quality = 10
  if (options.colorCount < 100) options.colorCount = 100
  const pixels = await loadImg(url)
  if (!pixels) return null
  const pixelArray = createPixelArray(pixels.data)
  const palette = quantization(pixelArray, options.quality)
  return options.colorCount >= 1 ? palette.slice(0, options.colorCount) : palette
}

export async function getDominanteColor(url: string, quality: number) {
  return (await getPallete(url, 1, quality))?.[0]
}
