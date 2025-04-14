import { deleteCanvas, readCanvas, upsertCanvas } from './canvas'

describe('test to canvas query', { sequential: true }, () => {
  const staticValue = {
    id: '234532',
    guildId: '123456789012345678',
    userId: '123456789012345678'
  }
  const canvas = {
    guildId: staticValue.guildId,
    userId: staticValue.userId,
    canvas: {
      id: staticValue.id,
      h: 100,
      w: 100,
      layers: [],
      version: '1' as const,
      title: 'test',
      visibility: 'public' as const
    }
  }

  test('readCanvas: should return an array', async () => {
    const result = await readCanvas('123456789012345678')
    expect(result).toBeInstanceOf(Object)
  })

  test('upsertCanvas: add a new canvas', async () => {
    const result = await upsertCanvas(canvas)
    staticValue.id = result?.id || staticValue.id
    expect(result?.operation).equal('insert')
  })
  test('upsertCanvas: update a canvas', async () => {
    canvas.canvas.title = 'test2'
    canvas.canvas.id = staticValue.id
    const result = await upsertCanvas(canvas)
    expect(result?.operation).equal('update')
  })
  test('deleteCanvas: intended to delete a canvas', async () => {
    const result = await deleteCanvas({ guild_id: staticValue.guildId, id: staticValue.id })
    expect(result?.operation).equal('delete')
  })
})
