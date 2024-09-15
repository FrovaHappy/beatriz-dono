import { Routes } from 'discord.js'
import { rest } from '.'

export const deleteServers = async (guildsIds: string[]): Promise<void> => {
  const { config } = globalThis
  console.log(`\nCleared ${guildsIds.length} servers...`)
  for (const guildId of guildsIds) {
    try {
      await rest.put(Routes.applicationGuildCommands(config.discordClient, guildId), {
        body: []
      })
    } catch (error: any) {
      console.log(`· failed ${guildId}: ${error.message}`)
    }
  }
}
