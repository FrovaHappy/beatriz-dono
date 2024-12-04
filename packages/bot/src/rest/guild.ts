import { type Guild, REST, Routes } from 'discord.js'

const rest = new REST({ version: '10' }).setToken(config.discordToken)

export async function getGuild(guildId: string): Promise<Guild | null> {
  return (await rest.get(Routes.guild(guildId)).catch(err => null)) as Guild
}