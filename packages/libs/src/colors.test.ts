import { getDominanteColor, getPallete } from './colors'

describe('getDominanteColor', () => {
  it('should return the dominante color of an image', async () => {
    const url = 'https://imgur.com/FNw87Rm.png'
    const color = await getDominanteColor(url, 10)
    expect(color).toEqual({
      b: 13,
      g: 11,
      r: 6
    })
  })
  it('should return null if the image is not found', async () => {
    const url = 'notFound.png'
    const color = await getDominanteColor(url, 10)
    expect(color).toBeFalsy()
  })
})

describe('getPallete', () => {
  it('should return the dominante color of an image', async () => {
    const url = 'https://imgur.com/FNw87Rm.png'
    const color = await getPallete(url, 3, 10)
    expect(color).toEqual([
      {
        b: 13,
        g: 11,
        r: 6
      },
      {
        b: 15,
        g: 13,
        r: 21
      },
      {
        b: 16,
        g: 32,
        r: 14
      }
    ])
  })
})
