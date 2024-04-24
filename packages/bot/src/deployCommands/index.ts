import type { BaseFileCommand } from '../types/BaseFiles'
import updatePublic from './updatePublic'
import updatePrivate from './updatePrivate'
import config from '../config'
import { REST, type Collection } from 'discord.js'
import updateOwner from './updateOwners'
import { clearForDelete, getForDelete } from '../setting'
import { deleteServers } from './deleteServers'

export const rest = new REST().setToken(config.discordToken)

async function GetCommands(
  collection: Collection<string, BaseFileCommand>
): Promise<Record<'public' | 'private' | 'owner', string[]>> {
  const commands: Record<BaseFileCommand['scope'], string[]> = {
    owner: [],
    private: [],
    public: []
  }
  collection.forEach(command => {
    commands[command.scope] = [command.data.toJSON(), ...(commands[command.scope] ?? [])]
  })
  return commands
}
export default async function deployCommand(collection: Collection<string, BaseFileCommand>): Promise<void> {
  const commands = await GetCommands(collection)
  const commandsReset = [...new Set([...getForDelete()])]
  await updatePublic(commands.public)
  await deleteServers(commandsReset)
  clearForDelete()
  await updatePrivate(commands.private)
  await updateOwner(commands.owner)
}
