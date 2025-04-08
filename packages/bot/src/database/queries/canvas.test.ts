import { readCanvas, upsertCanvas } from './canvas'

describe('test to canvas query', { sequential: true, timeout: 10_000 }, () => {
  test('readCanvas: should return an array', async () => {
    const result = await readCanvas('123456789012345678')
    expect(result).toBeInstanceOf(Object)
  })
  const staticValue = {
    id: '234532',
    guildId: '123456789012345678',
    userId: '123456789012345678'
  }
  test('upsertCanvas: add a new canvas', async () => {
    const result = await upsertCanvas({
      guildId: staticValue.guildId,
      userId: staticValue.userId,
      canvas: {
        id: staticValue.id,
        h: 100,
        w: 100,
        layers: [],
        version: '1',
        title: 'test',
        visibility: 'public'
      }
    })
    console.log(result)
    staticValue.id = result?.id || staticValue.id
    expect(result?.operation).equal('insert')
  })
  test('upsertCanvas: update a canvas', async () => {
    const result = await upsertCanvas({
      guildId: staticValue.guildId,
      userId: staticValue.userId,
      canvas: {
        id: staticValue.id,
        h: 100,
        w: 100,
        layers: [],
        version: '1',
        title: 'test',
        visibility: 'public'
      }
    })
    console.log(result)
    expect(result?.operation).equal('update')
  })
})
