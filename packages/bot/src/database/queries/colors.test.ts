import '../../config'

import { deleteColors, insertColors, readColors } from './colors'

describe('test Color Queries', () => {
  it('readColors: should return an object', async () => {
    const result = await readColors('1234567890123456')
    console.log({ result })
    expect(result).toBeInstanceOf(Object)
  })
  // it('readColors: should return null', async () => {
  //   const result = await readColors('1234')
  //   console.log({ result })
  //   expect(result).toBeNull()
  // })
  // it('insertColors: should return an object', async () => {
  //   const result = await insertColors({
  //     guild_id: '123456789012345678',
  //     colors: [
  //       {
  //         hex_color: '#ff0000',
  //         role_id: '123456789012345678'
  //       }
  //     ]
  //   })
  //   console.log({ result })
  //   expect(result).toBeInstanceOf(Object)
  // })
  // it('insertColors: should return null', async () => {
  //   const result = await insertColors({
  //     guild_id: '1234',
  //     colors: [
  //       {
  //         hex_color: '#ff0000',
  //         role_id: '123456789012345678'
  //       }
  //     ]
  //   })
  //   console.log({ result })
  //   expect(result).toBeNull()
  // })
  // it('deleteColors: should return an object', async () => {
  //   const result = await deleteColors('123456789012345678', [
  //     {
  //       hex_color: '#ff0000',
  //       role_id: '123456789012345678'
  //     }
  //   ])
  //   console.log({ result })
  //   expect(result).toBeInstanceOf(Array)
  // })
  // it('deleteColors: should return null', async () => {
  //   const result = await deleteColors('1234', [
  //     {
  //       hex_color: '#ff0000',
  //       role_id: '123456789012345678'
  //     }
  //   ])
  //   console.log({ result })
  //   expect(result).toBeNull()
  // })
})
