import type { ClientCustom } from '../../types/main'

export default async function updateBot(client: ClientCustom): Promise<void> {
  const time = 5 * 60 * 60 * 1000
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(async () => {
    const guilds = (await client.guilds.fetch()).size
    client.user?.setActivity(`Dando soporte a ${guilds} servers...`)
  }, time)
}
