import { REST, Routes } from 'discord.js'
import { getSetting } from '../setting'

const { config } = globalThis
const rest = new REST().setToken(config.discordToken)

export default async function updatePrivate(commands: any[]): Promise<void> {
  const { privatesServers } = getSetting()
  console.log(`\nDeploy Private Commands started with ${privatesServers.length} servers ...`)
  for (const guildId of privatesServers) {
    try {
      const data = (await rest.put(Routes.applicationGuildCommands(config.discordClient, guildId), {
        body: commands
      })) as any[]

      console.log(` · Done ${guildId} with ${data.length} commands`)
    } catch (error: any) {
      console.log(` · Fail ${guildId}: ${error.message}`)
    }
  }
}
