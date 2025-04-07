import '../../config'
import { readGuild, getGuilds } from './guild'

describe('test Guild Queries', () => {
  console.log('readGuild: should return an object')
  it('readGuild: should return an object', async () => {
    const result = await readGuild('12345678901351445678')
    expect(result).toBeInstanceOf(Object)
  })
  // it('readGuild: should return null', async () => {
  //   const result = await readGuild('1234')
  //   console.log({ result })
  //   expect(result).toBeNull()
  // })
  // it('readGuilds: should return an array', async () => {
  //   const result = await getGuilds()
  //   console.log({ result })
  //   expect(result).toBeInstanceOf(Array)
  // })
})
