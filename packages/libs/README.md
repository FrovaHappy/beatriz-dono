# @beatriz-dono/libs

Shared utilities library for the Beatriz Dono Discord bot project.

## Features

- 🎨 **Color Processing**: Advanced color palette extraction and manipulation
- 🖼️ **Image Processing**: Canvas-based image generation and manipulation  
- ✨ **Text Formatting**: User and server text formatting utilities
- 🔧 **Schema Validation**: Zod-based validation for complex data structures
- 🎯 **Type Safety**: Full TypeScript support with comprehensive type definitions

## Installation

```bash
npm install @beatriz-dono/libs
```

## Usage

### Color Utilities

```typescript
import { getPallete, hexToRgb, rgbToHex } from '@beatriz-dono/libs'

// Extract color palette from image
const imageData = await getImageData('path/to/image.jpg')
const colors = getPallete({ data: imageData?.data, length: 5 })
console.log(colors) // ['#ff0000', '#00ff00', '#0000ff', ...]

// Convert between hex and RGB
const rgb = hexToRgb('#ff0000') // { r: 255, g: 0, b: 0 }
const hex = rgbToHex({ r: 255, g: 0, b: 0 }) // '#ff0000'
```

### Image Generation

```typescript
import { generateImage, getFonts } from '@beatriz-dono/libs'

// Load fonts
await getFonts('./fonts')

// Generate welcome image
const canvas = {
  w: 800,
  h: 400,
  bg_color: '#212121',
  layers: [
    {
      type: 'text',
      text: 'Welcome {{user_name}}!',
      dx: 100,
      dy: 100,
      size: 32,
      family: 'Inter',
      color: '#ffffff'
    }
  ]
}

const imageBuffer = await generateImage(canvas, {
  userName: 'John',
  userId: '123456789',
  // ... other user data
})
```

### Schema Validation

```typescript
import { validateCanvas } from '@beatriz-dono/libs'

const result = validateCanvas(canvasData)
if (result.ok) {
  console.log('Canvas is valid!')
} else {
  console.error('Validation errors:', result.errors)
}
```

## API Reference

### Color Functions

- `getPallete(options)` - Extract color palette from image data
- `hexToRgb(hex)` - Convert hex color to RGB object
- `rgbToHex(rgb)` - Convert RGB object to hex string
- `findBiggestColorRange(colors)` - Find color channel with biggest range
- `orderByLuminance(colors)` - Sort colors by luminance

### Image Functions

- `getImageData(source)` - Load image data from URL or data URI
- `generateImage(canvas, userData)` - Generate image from canvas template
- `getFonts(fontPath)` - Load fonts from directory

### Text Functions

- `formatterTextUser(text, userData)` - Format text with user placeholders

### Schema Functions

- `validateCanvas(data)` - Validate canvas structure
- `isShape(layer)` - Check if layer is a shape
- `isText(layer)` - Check if layer is text

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch tests
npm run test:watch

# Build library
npm run build

# Run linting
npm run lint

# Type checking
npm run type-check
```

## Testing

This library includes comprehensive test coverage:

- **Unit Tests**: 66 tests covering all major functions
- **Integration Tests**: End-to-end testing of image generation
- **Coverage Reports**: 83%+ code coverage with detailed reporting
- **Network Tests**: Resilient tests for external image fetching

Run tests with coverage reporting:

```bash
npm run test:coverage
```

### Code Quality

- **TypeScript**: Full type safety and IntelliSense support
- **Biome**: Fast linting and formatting
- **Vitest**: Modern testing framework with great performance
- **Coverage**: v8 coverage reporting with HTML reports

## Dependencies

- `@napi-rs/canvas` - High-performance Canvas API
- `zod` - Schema validation

## License

MIT - see LICENSE file for details.
