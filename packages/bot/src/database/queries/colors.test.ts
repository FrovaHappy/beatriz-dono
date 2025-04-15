import '../../config'

import { type Color, deleteColors, insertColors, readColors, readColorsSettings, updateColorSetting } from './colors'
const staticValue = {
  guildId: '123456789012345678',
  userId: '123456789012345678'
}
let colors: Color[] = []
describe('test Color Queries', { sequential: true }, () => {
  it('readColors: should return an object', async () => {
    const result = (await readColors({ guild_id: staticValue.guildId }))!
    colors = result.colors
    expect(result).toBeInstanceOf(Object)
    expect(result.guild_id).toBe(staticValue.guildId)
  })
  it('insertColors: should return an object', async () => {
    const result = await insertColors({
      guild_id: staticValue.guildId,
      colors: [
        {
          hex_color: '#ff0000',
          role_id: '123456789012345678'
        }
      ]
    })
    expect(result).toBeInstanceOf(Object)
    const color = await readColors({ guild_id: staticValue.guildId })
    colors = color?.colors ?? []
  })

  it('deleteColors: should return an object', async () => {
    const result = await deleteColors({ guild_id: staticValue.guildId, colors })
    expect(result.colors.length < colors.length).toBeTruthy()
    console.log({ result, colors })
    colors = result.colors ?? []
  })
  it('deleteColors: filter out the color', async () => {
    const result = await deleteColors({
      guild_id: '1234',
      colors: [
        {
          hex_color: '#ff0000',
          role_id: 'error'
        },
        {
          hex_color: '#error',
          role_id: '123456789012345678'
        }
      ]
    })
    console.log({ result, colors })
    expect(colors.length === result.colors.length).toBeTruthy()
  })
})
describe('test Colors Settings Queries', { sequential: true }, () => {
  it('readColorsSettings: should return an object', async () => {
    const result = (await readColorsSettings(staticValue.guildId))!
    expect(result).toBeInstanceOf(Object)
    expect(result.guild_id).toBe(staticValue.guildId)
  })
  it('updateColorSetting: update pointer_id to new value', async () => {
    const pointer_id = '123456789012345678'
    const result = await updateColorSetting({
      guild_id: staticValue.guildId,
      pointer_id
    })
    expect(result).toBeInstanceOf(Object)
    expect(result!.guild_id).toBe(staticValue.guildId)
    expect(result!.pointer_id).toBe(pointer_id)
    expect(result!.templete).toBeNull()
    expect(result!.is_active).toBeFalsy()
  })
  it('updateColorSetting: update pointer_id to null', async () => {
    const pointer_id = null
    const result = await updateColorSetting({
      guild_id: staticValue.guildId,
      pointer_id
    })
    expect(result).toBeInstanceOf(Object)
    expect(result!.guild_id).toBe(staticValue.guildId)
    expect(result!.pointer_id).toBeNull()
    expect(result!.templete).toBeNull()
    expect(result!.is_active).toBeFalsy()
  })
  it('updateColorSetting: update templete', async () => {
    const templete = { version: 1, colors: [{ hex_color: '#ff0000', role_id: '123456789012345678' }] }
    console.log(JSON.stringify(templete))
    const result = await updateColorSetting({
      guild_id: staticValue.guildId,
      templete: JSON.stringify(templete)
    })
    expect(result).toBeInstanceOf(Object)
    expect(result!.guild_id).toBe(staticValue.guildId)
    expect(result!.pointer_id).toBeNull()
    expect(result!.templete).toEqual(JSON.stringify(templete))
    expect(result!.is_active).toBeFalsy()
  })
  it('updateColorSetting: update templete to null', async () => {
    const templete = null
    const result = await updateColorSetting({
      guild_id: staticValue.guildId,
      templete
    })
    expect(result).toBeInstanceOf(Object)
    expect(result!.guild_id).toBe(staticValue.guildId)
    expect(result!.pointer_id).toBeNull()
    expect(result!.templete).toBeNull()
    expect(result!.is_active).toBeFalsy()
  })
})
