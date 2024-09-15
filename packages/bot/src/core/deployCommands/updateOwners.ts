import { REST, Routes } from 'discord.js'
import { getSetting } from '../setting'

const { config } = globalThis
const rest = new REST().setToken(config.discordToken)

export default async function updateOwner(commands: any[]): Promise<void> {
  const { ownersServers } = getSetting()
  console.log(`\nDeploy owner Commands started with ${ownersServers.length} servers ...`)
  for (const guildId of ownersServers) {
    try {
      for (const c of commands) {
        await rest.post(Routes.applicationGuildCommands(config.discordClient, guildId), {
          body: c
        })
      }
      console.log(` · Done ${guildId} with ${commands.length} commands`)
    } catch (error: any) {
      console.log(` · Fail ${guildId}: ${error.message}`)
    }
  }
}
