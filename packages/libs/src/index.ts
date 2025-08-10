// Main exports for the libs package

// Color utilities
export {
  getPallete,
  hexToRgb,
  rgbToHex,
  findBiggestColorRange,
  orderByLuminance
} from './colors'

// Server-side utilities (Canvas, Image processing)
export {
  getFonts,
  getImageData,
  generateImage
} from './server'

// Browser-side utilities
export * from './browser'

// Text formatting utilities
export { formatterTextUser } from './formatterText'

// Regular expressions
export { default as regex } from './regex'

// Schemas
export * from './schemas/welcome.v1'
export * from './schemas/colorsTemplete'

// Canvas painting utilities
export { default as paintCanvas } from './PaintCanvas'

// Constants
export { default as fonts } from './constants/fonts'
export { default as colorTemplete } from './constants/colorTemplete'
export { default as fluentTemplate } from './constants/imagesTemplate/fluent'

// Types (explicit exports to avoid conflicts)
export type { Guild, User } from './types'
