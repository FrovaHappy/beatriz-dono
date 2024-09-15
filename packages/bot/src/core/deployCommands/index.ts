import updatePublic from './updatePublic'
import updatePrivate from './updatePrivate'
import {
  REST,
  type RESTPostAPIChatInputApplicationCommandsJSONBody as CommandDataJson,
  type Collection
} from 'discord.js'
import updateOwner from './updateOwners'
import { clearForDelete, getForDelete } from '../setting'
import { deleteServers } from './deleteServers'
import { type Scope } from '@/types/main'
import { type Command } from '../build/BuildCommand'
const { config } = globalThis
export const rest = new REST().setToken(config.discordToken)

async function GetCommands(collection: Collection<string, Command>): Promise<Record<Scope, CommandDataJson[]>> {
  const commands: Record<Scope, CommandDataJson[]> = {
    owner: [],
    private: [],
    public: []
  }
  collection.forEach(command => {
    commands[command.scope] = [command.data.toJSON(), ...(commands[command.scope] ?? [])]
  })
  return commands
}
export default async function deployCommand(collection: Collection<string, Command>): Promise<void> {
  const commands = await GetCommands(collection)
  const commandsReset = [...new Set([...getForDelete()])]
  await updatePublic(commands.public)
  await deleteServers(commandsReset)
  clearForDelete()
  await updatePrivate(commands.private)
  await updateOwner(commands.owner)
}
