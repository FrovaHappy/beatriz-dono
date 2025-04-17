import fs from 'node:fs/promises'
import { validateCanvas } from './schema.welcome.v1'
import template from './template.welcome'

import { join } from 'node:path'
import { GlobalFonts } from '@napi-rs/canvas'
import { getFonts } from '../getFonts'
import { generateImage } from '../server'

beforeEach(async () => {
  console.time('loadFonts')
  const fonts = await getFonts(join('.', 'public/fonts'))
  for (const font of fonts) {
    GlobalFonts.registerFromPath(font.buffer, font.family)
  }
  console.timeEnd('loadFonts')
})

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
  guildId: '46234567890'
}

describe('PaintCanvas', () => {
  it('pass validation zod test', async () => {
    expect(validateCanvas(template)).toEqual({ ok: true, errors: undefined })
  })
  it('should paint the canvas', async () => {
    const imageBuffer = await generateImage({ template, filterText })
    await fs.writeFile('test.webp', imageBuffer)
    expect(imageBuffer).instanceOf(Buffer)
  })
})
