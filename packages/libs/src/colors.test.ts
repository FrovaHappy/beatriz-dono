import { getPallete, loadImage, filterColorTolerance } from './colors'

describe('find biggest color range ', () => {
  it('should return the dominante color of an image with a black background', async () => {
    const color = filterColorTolerance([
      { r: 0, g: 0, b: 0 },
      { r: 0, g: 0, b: 0 },
      { r: 0, g: 0, b: 255 }
    ])
    expect(color).toHaveLength(1)
  })
  it('should return the dominante color of an image with a white background', async () => {
    const color = filterColorTolerance([
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 255, b: 255 },
      { r: 0, g: 0, b: 244 }
    ])
    expect(color).toHaveLength(1)
  })
})

describe('get pallete ', async () => {
  const url =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMUAAACUCAMAAAAUNB2QAAAAA1BMVEXuLCwP78c9AAAAM0lEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4NHJ4AAF0e6e2AAAAAElFTkSuQmCC'
  const data = await loadImage(url)

  it('should return the dominante color of an image', async () => {
    const color = await getPallete({ data, length: 1 })
    expect(color).toEqual([
      {
        b: 0,
        g: 0,
        r: 160
      }
    ])
  })
  it('should return null if the image is not found', async () => {
    const color = await getPallete({ data: null })
    expect(color).toBeFalsy()
  })
})
