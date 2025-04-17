import { getImageData } from './server'
describe('server', () => {
  it('should return an image data of a dataUri', async () => {
    const url =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAA1BMVEX/AAAZ4gk3AAAAPUlEQVR4nO3BMQEAAADCoPVPbQ0PoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvgyZwAABCrx9CgAAAABJRU5ErkJggg=='
    const data = (await getImageData(url)) || null

    expect(data?.height).toEqual(192)
    expect(data?.width).toEqual(204)
    expect(data?.data).instanceOf(Uint8ClampedArray)
    expect(data?.data.length).toEqual(192 * 204 * 4)
  })
  it('should return an image data of a url png', async () => {
    const url = 'https://upload.wikimedia.org/wikipedia/commons/2/24/Transparent_Square_Tiles_Texture.png'

    const data = (await getImageData(url)) || null
    expect(data?.height).toEqual(230)
    expect(data?.width).toEqual(252)
    expect(data?.data).instanceOf(Uint8ClampedArray)
    expect(data?.data.length).toEqual(230 * 252 * 4)
  })
  it('should return an image data of a url jpg', async () => {
    const url = 'https://i.pinimg.com/474x/a2/26/c4/a226c48e2fae2c466194df90069299e7.jpg'
    const data = (await getImageData(url)) || null

    expect(data?.height).toEqual(474)
    expect(data?.width).toEqual(474)
    expect(data?.data).instanceOf(Uint8ClampedArray)
    expect(data?.data.length).toEqual(474 * 474 * 4)
  })
})
