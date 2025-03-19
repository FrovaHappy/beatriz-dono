import { getPallete } from 'colors'
import { getImageData } from './server'
describe('server', () => {
  it('should return an image data of a dataUri', async () => {
    const url =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMUAAACUCAMAAAAUNB2QAAAAA1BMVEXuLCwP78c9AAAAM0lEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4NHJ4AAF0e6e2AAAAAElFTkSuQmCC'
    const data = (await getImageData(url)).data

    console.log(getPallete({ data: data, length: 1, format: 'hex' }))
    expect(data).toBeTruthy()
  })
  it('should return an image data of a url png', async () => {
    const url = 'https://upload.wikimedia.org/wikipedia/commons/2/24/Transparent_Square_Tiles_Texture.png'
    const data = (await getImageData(url)).data
    console.log(getPallete({ data: data, length: 1, format: 'hex' }))
    expect(data).toBeTruthy()
  })
  it('should return an image data of a url jpg', async () => {
    const url = 'https://i.imgur.com/v3t4w1B.jpg'
    const data = (await getImageData(url)).data
    console.log(getPallete({ data: data, length: 1, format: 'hex' }))
    expect(data).toBeTruthy()
  })
  it('should return an image data of a url gif', async () => {
    const url = 'https://i.pinimg.com/originals/e6/5d/50/e65d50f699ab952ca89c8525058c4a0d.gif'
    const data = (await getImageData(url)).data

    console.log(getPallete({ data: data, length: 1, format: 'hex' }))
    expect(data).toBeTruthy()
  })
})
