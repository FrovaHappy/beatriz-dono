import { getPallete, loadImage } from './colors'

describe('get palete ', async () => {
  const url =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMUAAACUCAMAAAAUNB2QAAAAA1BMVEXuLCwP78c9AAAAM0lEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4NHJ4AAF0e6e2AAAAAElFTkSuQmCC'
  const data = await loadImage(url)

  it('should return the dominante color of an image', async () => {
    const color = await getPallete({ data, length: 1 })
    expect(color).toEqual([
      {
        b: 65,
        g: 68,
        r: 73
      }
    ])
  })
  it('should return null if the image is not found', async () => {
    const color = await getPallete({ data: null })
    expect(color).toBeFalsy()
  })
})
