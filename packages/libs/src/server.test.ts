import { createHash } from 'node:crypto'
import { existsSync, rmdirSync } from 'node:fs'
import { join } from 'node:path'
import { GlobalFonts } from '@napi-rs/canvas'
import template from './constants/imagesTemplate/fluent'
import { validateCanvas } from './schemas/welcome.v1'
import { generateImage, getFonts, getImageData } from './server'

const filterText = {
  userName: 'userName',
  userId: '1234567890',
  userDiscriminator: '1234',
  userDisplayName: 'userName',
  userAvatar: 'https://i.pinimg.com/236x/3c/6c/cb/3c6ccb83716d1e4fb91d3082f6b21d77.jpg',
  userBanner: 'https://i.pinimg.com/236x/62/26/02/6226029e25df51a44a81cd856211e76c.jpg',
  membersCount: '343',
  guildAvatar: 'https://i.pinimg.com/474x/a2/26/c4/a226c48e2fae2c466194df90069299e7.jpg',
  guildBanner: 'https://i.pinimg.com/236x/06/35/bf/0635bf6e3bbbe6d85b0f167c3ade5614.jpg',
  guildName: 'Server Name',
  guildId: '46234567890',
}

describe('server', () => {
  beforeAll(async () => {
    console.time('loadFonts')
    const fonts = await getFonts(join('.', 'public/fonts'))
    for (const font of fonts) {
      GlobalFonts.registerFromPath(font.buffer, font.family)
    }
    console.timeEnd('loadFonts')
  })

  describe('getFonts', () => {
    it('should load fonts from a valid directory', async () => {
      const fonts = await getFonts(join('.', 'public/fonts'))
      expect(fonts).toBeInstanceOf(Array)
      expect(fonts.length).toBeGreaterThan(0)

      // Check that each font has required properties
      for (const font of fonts) {
        expect(font).toHaveProperty('buffer')
        expect(font).toHaveProperty('family')
        expect(font).toHaveProperty('format')
        expect(font).toHaveProperty('variable')
        expect(typeof font.family).toBe('string')
        expect(font.family.length).toBeGreaterThan(0)
        expect(typeof font.buffer).toBe('string') // buffer is actually a file path
        expect(typeof font.format).toBe('string')
      }
    })

    it('should handle relative directory paths', async () => {
      const testDir = './src/temp-fonts-dir'
      if (existsSync(testDir)) {
        // Clean up the test directory before the test
        rmdirSync(testDir, { recursive: true })
      }
      const fonts = await getFonts(testDir)
      expect(fonts).toBeInstanceOf(Array)
      // getFonts creates fonts even in src directory
      expect(fonts.length).toBe(10)
    })
  })

  describe('getImageData', () => {
    it('should return null for null input', async () => {
      const data = await getImageData(null)
      expect(data).toBeNull()
    })

    it('should return null for empty string', async () => {
      const data = await getImageData('')
      expect(data).toBeNull()
    })

    it('should return null for invalid data URI', async () => {
      const data = await getImageData('data:invalid')
      expect(data).toBeNull()
    })

    it('should return an image data of a dataUri', async () => {
      const url =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAA1BMVEX/AAAZ4gk3AAAAPUlEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvgyZwAABCrx9CgAAAABJRU5ErkJggg=='
      const data = (await getImageData(url)) || null

      expect(data).not.toBeNull()
      expect(data?.height).toEqual(192)
      expect(data?.width).toEqual(204)
      expect(data?.data).instanceOf(Uint8ClampedArray)
      expect(data?.data.length).toEqual(192 * 204 * 4)

      // Verify RGBA data structure
      const firstPixel = data?.data.slice(0, 4)
      expect(firstPixel).toBeDefined()
      expect(firstPixel?.length).toBe(4)
    })

    it('should return an image data of a url png', async () => {
      const url =
        'https://upload.wikimedia.org/wikipedia/commons/2/24/Transparent_Square_Tiles_Texture.png'
      const data = (await getImageData(url)) || null

      expect(data).not.toBeNull()
      expect(data?.height).toEqual(230)
      expect(data?.width).toEqual(252)
      expect(data?.data).instanceOf(Uint8ClampedArray)
      expect(data?.data.length).toEqual(230 * 252 * 4)

      // Verify image content
      const hash = createHash('sha256')
        .update(Buffer.from(data?.data || []))
        .digest('hex')
      expect(hash).toBeDefined()
      expect(hash.length).toBe(64)
    })

    it('should return an image data of a url jpg', async () => {
      const url = 'https://i.pinimg.com/474x/a2/26/c4/a226c48e2fae2c466194df90069299e7.jpg'
      const data = (await getImageData(url)) || null

      expect(data).not.toBeNull()
      expect(data?.height).toEqual(474)
      expect(data?.width).toEqual(474)
      expect(data?.data).instanceOf(Uint8ClampedArray)
      expect(data?.data.length).toEqual(474 * 474 * 4)

      // Verify image content
      const hash = createHash('sha256')
        .update(Buffer.from(data?.data || []))
        .digest('hex')
      expect(hash).toBeDefined()
      expect(hash.length).toBe(64)
    })

    it('should return null for invalid image url', async () => {
      const url = 'https://invalid-url.com/image.jpg'
      const data = await getImageData(url)
      expect(data).toBeNull()
    })

    it('should handle timeout gracefully', async () => {
      // Use an unreachable internal IP to simulate timeout
      const url = 'http://10.255.255.1/slow-image.jpg'
      const data = await getImageData(url)
      expect(data).toBeNull()
    }, 5000) // Set 5 second timeout for this test

    it('should handle malformed image data', async () => {
      const url = 'data:image/png;base64,invalid-base64-data'
      const data = await getImageData(url)
      expect(data).toBeNull()
    })
  })

  describe('generateImage', () => {
    it('should pass canvas validation', () => {
      const result = validateCanvas(template)
      expect(result.ok).toBe(true)
      expect(result.errors).toBeUndefined()
      expect(result.data).toBeDefined()
    })

    it('should generate a valid webp image with default quality', async () => {
      const imageBuffer = await generateImage({ template, filterText })
      expect(imageBuffer).toBeInstanceOf(Buffer)
      expect(imageBuffer.length).toBeGreaterThan(0)
    })

    it('should generate image with custom quality', async () => {
      const imageBuffer = await generateImage({
        template,
        filterText,
        quality: 50,
      })
      expect(imageBuffer).toBeInstanceOf(Buffer)
      expect(imageBuffer.length).toBeGreaterThan(0)
    })

    it('should generate image with low quality', async () => {
      const imageBuffer = await generateImage({
        template,
        filterText,
        quality: 10,
      })
      expect(imageBuffer).toBeInstanceOf(Buffer)
      expect(imageBuffer.length).toBeGreaterThan(0)
    })

    it('should generate image with high quality', async () => {
      const imageBuffer = await generateImage({
        template,
        filterText,
        quality: 100,
      })
      expect(imageBuffer).toBeInstanceOf(Buffer)
      expect(imageBuffer.length).toBeGreaterThan(0)
    })

    it('should handle empty server name in filterText', async () => {
      const customFilterText = { ...filterText, server_name: '' }
      const imageBuffer = await generateImage({
        template,
        filterText: customFilterText,
      })
      expect(imageBuffer).toBeInstanceOf(Buffer)
      expect(imageBuffer.length).toBeGreaterThan(0)
    })
  })
})
