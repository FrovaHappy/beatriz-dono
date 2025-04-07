import { readCanvas, upsertCanvas } from './canvas'

describe('test to canvas query', () => {
  test('readCanvas: should return an array', async () => {
    const result = await readCanvas('123456789012345678')
    console.log({ result })
    expect(result).toBeInstanceOf(Object)
  })
  test('upsertCanvas: should return an object', async () => {
    const result = await upsertCanvas({
      guildId: '123456789012345678',
      canvas: { h: 100, w: 100, layers: [], version: '1', title: 'test' },
      userId: '123456789012345678'
    })
    expect(result).equal({ guild_id: '123456789012345678', scope_bot: 'public' })
  })
})
